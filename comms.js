const config = require('./botconfig.json');
const tools = require("./tools.js");
const fs = require('fs');
const Discord = require('discord.js'); 
const prefix = config.prefix;
const userdb = require('./userdb.json');
let token = config.gitToken;

const Axios = require('axios');
const colors = require('colors');
const { Octokit } = require ('@octokit/core');
const { isNullOrUndefined } = require('util');

const octokit = new Octokit({
        auth: token
});

async function stop (bot, mess, args) 
{
        if(mess.author.id != "643129279298928641") return mess.channel.send("You don't have permission to stop me!")
        else{
                await mess.channel.send("The bot is turning off...");
                process.exit();
        }
}

function play (bot, mess, args) {
        if (mess.channel.type == "text") {
                if(mess.member.voice.channel) {
                        if(mess.member.voice.channel.permissionsFor(mess.member.client.user).has("CONNECT") && mess.member.voice.channel.permissionsFor(mess.member.client.user).has("SPEAK")){
                                var voiceChannel = mess.member.voice.channel;
                                if(args[1]) {
                                        var files = fs.readdirSync("./");
                                        for(i = 0; i < files.length; i++) {
                                                if(files[i].indexOf(".mp3") == -1 || files[i].indexOf(".mp3.sfk") > -1) {
                                                        files.splice(i, 1);
                                                        i--;
                                                }
                                                else files[i] = files[i].slice(0, files[i].lastIndexOf(".mp3"));
                                        }
                                        if(files.indexOf(args[1].toLowerCase()) > -1) {
                                                voiceChannel.join().then(connection => {
                                                        const dispatcher = connection.play(`./${args[1].toLowerCase()}.mp3`);
                                                        dispatcher.on('finish', () => voiceChannel.leave());
                                                }).catch(err => console.log(err));
                                        }
                                        else mess.channel.send("Couldn't find a file with that name.\nIf not sure, please type `c!tracklist` and check the list.");
                                }
                                else {
                                        voiceChannel.join().then(connection => {
                                                const dispatcher = connection.play('./cumzone.mp3');
                                                dispatcher.on('finish', () => voiceChannel.leave());
                                        }).catch(err => console.log(err));
                                }
                        }
                        else mess.channel.send("I don't have a permission to connect to your current voice channel. Please try another one or ask the server admin to give me a permission!");
                }
                else mess.channel.send("For that command to work, you need to be in a voice channel.");
        }
        else mess.channel.send("Unfortunately, this command doesn't seem to work here. Try typing it in a server text channel where I have permission to read it!");
}

function playme (bot, mess, args) {
        if (mess.channel.type == "text") {
                if(mess.member.voice.channel) {
                        if(mess.member.voice.channel.permissionsFor(mess.member.client.user).has("CONNECT") && mess.member.voice.channel.permissionsFor(mess.member.client.user).has("SPEAK")) {
                                tools.greeting(mess.member); 
                        }
                        else mess.channel.send("I don't have a permission to connect to your current voice channel. Please try another one or ask the server admin to give me a permission!");
                }
                else mess.channel.send("For that command to work, you need to be in a voice chat.");
        }
        else mess.channel.send("Unfortunately, this command doesn't seem to work here. Try typing it in a server text channel where I have permission to read it!");
}

function help (bot, mess, args) {
        let embed = new Discord.MessageEmbed()
                .setColor('#FFD800')
                .setTitle('Bot commands')
                .addField('\u200B', '**Text channel commands**')
                .addFields(
                        { name: '\tc!play', value: 'Welcomes you to the cum zone' },
                        { name: 'c!play <trackname>', value: 'Plays a certain music file by its name' },
                        { name: 'c!playme', value: 'Plays one of your personal greetings' },
                        { name: 'c!tracklist', value: 'Shows the full list of mp3 track names' },
                        { name: 'c!mytl', value: 'Shows the list of your personal mp3 track names' }
                )
                .addField('\u200B', '**DM commands**')
                .addFields(
                        { name: 'c!add', value: 'Adds a file to your personal greetings' },
                        { name: 'c!delete', value: 'Removes a file from your personal greetings' },
                        { name: 'c!tracklist', value: 'Shows the full list of mp3 track names' },
                        { name: 'c!mytl', value: 'Shows the list of your personal mp3 track names' }
                )
                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLXEzTKb29OCSxvrjsqu1RY9_DTna6T9NluIXp7eXeyZ1uaurTPzVeuJdQSfJrrvC2sF5aj58GJ8NbduPm0ppSuL3PakkBvZaz17MsXtLo80Y5MVZQrUchaMAdzGgsnrmyuDKsmQvOyP7zhG24TRHVfT=s216-no');
        mess.channel.send(embed);
        //mess.channel.send("**Bot commands:**\n`c!play` — welcomes you to the cum zone.\n`c!play <trackname>` — plays a certain music file.
        //\n`c!tracklist` — shows the full list of mp3 track names.\n`c!playme` — plays your personal greeting.");
}

function tracklist (bot, mess, args) {
        let mp3files = [];
        var files = fs.readdirSync("./");
        for(i = 0; i < files.length; i++){
                if(files[i].indexOf(".mp3") == -1 || files[i].indexOf(".mp3.sfk") > -1 || files[i].indexOf(".secret") > -1) {
                        files.splice(i, 1);
                        i--;
                }
                else {
                        files[i] = files[i].slice(0, files[i].lastIndexOf(".mp3"));
                        mp3files.push(files[i]);
                }
        }
        let third = Math.ceil(mp3files.length / 3);
        let embed = new Discord.MessageEmbed()
                .setColor('#FFD800')
                .setTitle('Available music files')
                .addFields(
                        { name: '\u200B', value: mp3files.slice(0, third), inline: true  },
                        { name: '\u200B', value: mp3files.slice(third, third * 2), inline: true },
                        { name: '\u200B', value: mp3files.slice(third * 2), inline: true },
                )
                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLVX4XmndLLx-5fkLnc4JfZZfhb4_YVv4SHSTxUOOVVnTycCe8kun5VAu_tymUD6eXG-o1qr2luVDZBZH_yYyfqv8E8K8Lmd2QxrpqNpWnGicezdN7BrEh8vlC41bJh_zh1MG0llAKUmgBQJCXBCdBkN=w296-h270-no');
        mess.channel.send(embed);
}

function tlmy (bot, mess, args) {
        if (mess.author.id in userdb) {
                if (userdb[mess.author.id].username != mess.author.username) userdb[mess.author.id].username = mess.author.username;
                if (userdb[mess.author.id].playlist.length > 0) {
                        files = userdb[mess.author.id].playlist.slice();
                        for(i = 0; i < files.length; i++){
                                files[i] = files[i].slice(2);
                        }
                        let embed = new Discord.MessageEmbed()
                                .setColor('#FFD800')
                                .setTitle(mess.author.username + '\'s personal greeting files')
                                .setDescription(files)
                                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLVX4XmndLLx-5fkLnc4JfZZfhb4_YVv4SHSTxUOOVVnTycCe8kun5VAu_tymUD6eXG-o1qr2luVDZBZH_yYyfqv8E8K8Lmd2QxrpqNpWnGicezdN7BrEh8vlC41bJh_zh1MG0llAKUmgBQJCXBCdBkN=w296-h270-no');
                        mess.channel.send(embed);
                }
                else {
                        if (mess.channel.type == "dm") mess.channel.send("Your personal tracklist is empty. Type `c!add` with a .mp3 file attached if you want to set a new greeting!");
                        else mess.channel.send("Your personal tracklist is empty. DM me with `c!add` and a .mp3 file attached if you want to set a new greeting!");
                }
        }
        else {
                if (mess.channel.type == "dm") mess.channel.send("It seems like you don't have any personal greetings yet. Type `c!add` with a .mp3 file attached if you want to get one!");
                else mess.channel.send("It seems like you don't have any personal greetings yet. DM me with `c!add` and a .mp3 file attached if you want to get one!");
        }
}

// GitHub uploading function for "add" and "dlt"

const gitHubUpload = async (path, mess) => {
        try {
                let content = fs.readFileSync(path, 'base64');
                /*try { fs.writeFileSync('./1111.mp3', content); }
                catch (e) { console.log(e); };*/
                console.log(`  The file ${path} has been successfully read and is about to be sent to the GitHub repo.`.yellow);
                let params = {
                        owner: 'ririkurashu',
                        repo: 'lolik-cz',
                        path: path.slice(2),
                        message: 'Uploaded by ' + mess.author.username + ' via the bot',
                        content
                };
                let sha = '';
                try {
                        const responseGET = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                                owner: 'ririkurashu',
                                repo: 'lolik-cz',
                                path: path.slice(2)
                        });
                        console.log("  Status:".yellow, responseGET.status, "\n  The file already exists in the GitHub repository. Trying to replace it...".yellow);
                        sha = responseGET.data.sha;
                }
                catch (error) {};
                
                if (sha != '') params.sha = sha;
                const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', params);
                console.log("  Status:".yellow, response.status, "\n  (more info: https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents)");
                return new Promise ((resolve, reject) => resolve()); 
        } 
        catch (err) {
                console.log("  Upload of", `${path}`.cyan, "to GitHub failed, deleting files...\n");
                try {
                        fs.unlinkSync(path);
                        let index = userdb[mess.author.id].playlist.indexOf(path);
                        userdb[mess.author.id].playlist.splice(index, 1);
                        json = JSON.stringify(userdb, null, "\t");
                        fs.writeFile('./userdb.json', json, 'utf8', function(error) {
                                if(error) {
                                        console.log(`  Couldn't remove ${filename} from .json.\n${error}`.red);
                                        return new Promise ((resolve, reject) => reject(err));
                                }
                        });
                }
                catch (error) { console.log(`  Couldn't remove files.\n${error}`.red); }
                finally { return new Promise ((resolve, reject) => reject(err)); };
        }
}

function add (bot, mess, args) {
        if (mess.channel.type == "dm") {
                if (mess.author.bot) return;
                if (mess.author.id in userdb) if (userdb[mess.author.id].playlist.length >= 6) return mess.channel.send("Your tracklist is too huge! Please delete some of your files before adding any new ones.");
                
                // json updating function

                const jsonUpdate = async path => {
                        try {
                                if (mess.author.id in userdb) {
                                        if (!userdb[mess.author.id].playlist.includes(path)) {
                                                userdb[mess.author.id].playlist.push(path);
                                                if (userdb[mess.author.id].username != mess.author.username) userdb[mess.author.id].username = mess.author.username;
                                                json = JSON.stringify(userdb, null, "\t");
                                                return new Promise((resolve, reject) => {
                                                        fs.writeFile('./userdb.json', json, 'utf8', function(error) {
                                                                if(error) {
                                                                        if (fs.existsSync(path))
                                                                        {
                                                                                console.log("2. File " + path + " has been downloaded, but it seems to be an error with adding it to the .json. Deleting " + path + "...");
                                                                                fs.unlinkSync(path);
                                                                        }
                                                                        reject(error);
                                                                }
                                                                else resolve();
                                                        });
                                                });
                                        }
                                }
                                else {
                                        userdb[mess.author.id] = {
                                                "username": mess.author.username,
                                                "playlist": [path]
                                        };
                                        json = JSON.stringify(userdb, null, "\t");
                                        return new Promise((resolve, reject) => {
                                                fs.writeFile('./userdb.json', json, 'utf8', function(error) {
                                                        if(error) {
                                                                if (fs.existsSync(path))
                                                                {
                                                                        console.log("2. File " + path + " has been downloaded, but it seems to ne an error with adding it to the .json. Deleting " + path + "...");
                                                                        fs.unlinkSync(path);
                                                                }
                                                                return reject(error);
                                                        }
                                                        else resolve();
                                                });
                                        });
                                }
                        }
                        catch (error) { 
                                return new Promise((resolve, reject) => reject(error));
                        }
                }

                // file downloading functions

                const downloadFile = async url => {
                        try {
                                if (!mess.attachments.first().name.toLowerCase().endsWith('.mp3')) {
                                        mess.channel.send("Your file needs to have a `.mp3` extension.");
                                        console.log("1. The file is not in .mp3 extension.".red);
                                        return new Promise((resolve, reject) => reject());
                                }
                                if (mess.attachments.first().size > 524288) { 
                                        mess.channel.send("Sorry, but your file must be 512 KB or less.");
                                        console.log("1. The file is too big.".red);
                                        return new Promise((resolve, reject) => reject());
                                }
                                let fileName = mess.attachments.first().name.toLowerCase().replace(/(\.mp3)+/g, '.mp3').replace(/[^a-zа-яё0-9\.]/g, '');
                                if (fileName.length > 22) fileName = fileName.slice(0, 18) + '.mp3';
                                if (fileName == '.mp3') fileName = Date.now() + fileName;
                                let path = './' + fileName;
                                if (mess.author.id in userdb) {
                                        var files = fs.readdirSync("./");
                                        if(files.indexOf(fileName) > -1 && !userdb[mess.author.id].playlist.includes(path)) {
                                                mess.channel.send("Sorry, but a file with that name already exists and belongs to someone else.");
                                                console.log("1. A file with that name already exists and belongs to someone else.".red);
                                                return new Promise((resolve, reject) => reject());
                                        }
                                }
                                const writer = fs.createWriteStream(path);
                                const response = await Axios({
                                        url,
                                        method: 'GET',
                                        responseType: 'stream'
                                });
                                response.data.pipe(writer);

                                return new Promise((resolve, reject) => {
                                        writer.on('close', async () => { 
                                                console.log(`1. Successfully downloaded the file.`.green);
                                                await jsonUpdate(path)
                                                .then(async () => {
                                                        console.log("2. Asynchronous writing of the file".green, "userdb.json".cyan, "is complete.".green);
                                                        //mess.channel.send("Your file has been successfully uploaded and added to your personal greetings!");
                                                        await gitHubUpload(path, mess)
                                                        .then(async () => {
                                                                console.log("3.1. Successfully uploaded the file".green, `${path}`.cyan, "to GitHub.".green);
                                                                await gitHubUpload('./userdb.json', mess)
                                                                .then(() => {
                                                                        console.log("3.2. Successfully uploaded the file".green, './userdb.json'.cyan, "to GitHub.".green);
                                                                        mess.channel.send("Your file has been successfully uploaded and added to your personal greetings!");
                                                                        resolve();
                                                                }).catch(error => {
                                                                        console.log(`3.2. Failed to upload the file`.red, `./userdb.json`.cyan, `to GitHub.\n${error}`.red);
                                                                        reject();
                                                                });
                                                        }).catch(error => {
                                                                console.log(`3.1. Failed to upload the file`.red, `${path}`.cyan, `to GitHub.\n${error}`.red);
                                                                reject();
                                                        });
                                                }).catch(error => {
                                                        console.log(`2. Failed to rewrite .json file.\n${error}`.red);
                                                        reject();
                                                });
                                        });
                                        writer.on('error', () => {
                                                console.log(`1. Failed to download the file.\n${error}`.red);
                                                reject();
                                        });
                                });
                        }
                        catch (e) { 
                                console.log(`1. An error has occurred during the file download.\n${e}`.red);
                                return new Promise((resolve, reject) => reject());
                        }
                };

                const download = async url => {
                        console.log(`Downloading: ${url}`.yellow);
                        await downloadFile(url)
                        .catch(() => {
                                let embed = new Discord.MessageEmbed()
                                        .setColor('#FFD800')
                                        .setTitle('Something went wrong during your file upload')
                                        .setDescription("Please try again. If it keeps happening and you don't understand why, contact <@643129279298928641> for help.")
                                        .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLUmOjIw2rX836oBzGOvftmUoCs6-YsdWt81LxpbJsw6WDbsf8oVBwmf3yBmASJVHuA_le1D5rfF3u4T-j6hU5yBY1GgNLGzv7QBSLcWJXt3desurGOoPTbl77nVzll8JdrRxrlFdEF_0q7ueC20T8F6=w249-h220-no');
                                mess.channel.send(embed);
                        });
                };
                

                if (!mess.attachments.first()) {
                        let embed = new Discord.MessageEmbed()
                                .setColor('#FFD800')
                                .setTitle('Please send me a file you want to add to your greetings')
                                .setDescription("While preparing the file, please note that:\n•  it must be in **.mp3** extension;\n•  it must be **512 KB** or less.\nOtherwise, the file won't be accepted.\nBesides that, it's also highly recommended that:\n•  the file duration be shorter than **10 seconds**;\n•  the file volume be under **12 dB** (as shown in the picture on the right).\nPlease respect yourself and the others. Even if you won't care enough to follow the recommendations above, and the server admin can't configure the bot directly, they can still ban it or you from the server.")
                                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLWg9NRc93lE50rac7OaX70sMUhvWOAoLmslr7J4UYbteXpNKemTBNTlAQpKfFBXRATLLORVO3hOwpt-RO8auLW_Kj8Rdh6vkdU1hLWc29Os_k7XRJ7wVARvIxgvRmlz0tbJ0aYbAqBIcOYnYypfaLzc=w53-h68-no');
                        mess.channel.send(embed);
                        const filter = m => m.attachments.first();
                        mess.channel.awaitMessages( filter, { max: 1, time: 90000, errors: ['time'] })
                        .then((collected) => {
                                mess = collected.first();
                                console.log(`\nUser ${mess.author.username} tries to add a file named ${mess.attachments.first().name}.`.yellow);
                                download(mess.attachments.first().url);
                        })
                        .catch((collected) => {
                                mess.channel.send("Looks like you haven't sent me the file for too long. Try again with `c!add` when you feel like it!");
                                console.log(`The user ${mess.author.username} typed me with c!add but has't sent me the file for too long.`);
                        });
                }
                else {
                        console.log(`\nUser ${mess.author.username} tries to add a file named ${mess.attachments.first().name}.`.yellow);
                        download(mess.attachments.first().url);
                }
        }
        else mess.channel.send("Let's not spam this channel and let no one interrupt us.\nSend me a direct message with this command!");
}

function dlt (bot, mess, args) {
        const gitHubRemove = async filename => {
                try {
                        const responseGET = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                                owner: 'ririkurashu',
                                repo: 'lolik-cz',
                                path: filename
                        });
                        console.log("Status:".yellow, responseGET.status, "\n  The file exists in the GitHub repository. Trying to delete it...".yellow);
                        let sha = responseGET.data.sha;
                        const response = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
                                owner: 'ririkurashu',
                                repo: 'lolik-cz',
                                path: filename,
                                message: 'Deleted by ' + mess.author.username + ' via the bot',
                                sha
                        });
                        console.log("  Status:".yellow, response.status, "\n  (more info: https://docs.github.com/en/rest/reference/repos#delete-a-file)");
                        return new Promise ((resolve, reject) => resolve()); 
                }
                catch (error) {
                        let embed = new Discord.MessageEmbed()
                                .setColor('#FFD800')
                                .setTitle('Something went wrong during your file deletion')
                                .setDescription("Please try again. If it keeps happening and you don't understand why, contact <@643129279298928641> for help.")
                                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLUmOjIw2rX836oBzGOvftmUoCs6-YsdWt81LxpbJsw6WDbsf8oVBwmf3yBmASJVHuA_le1D5rfF3u4T-j6hU5yBY1GgNLGzv7QBSLcWJXt3desurGOoPTbl77nVzll8JdrRxrlFdEF_0q7ueC20T8F6=w249-h220-no');
                        mess.channel.send(embed);
                        return new Promise ((resolve, reject) => reject(error)); 
                }
        }
        
        const removeFiles = async () => {
                return new Promise((resolve, reject) => {
                        if (mess.author.id in userdb) {
                                if (userdb[mess.author.id].playlist.length > 0) {
                                        if(args[1]) {
                                                console.log(`\nUser ${mess.author.username} tries to delete a file named ${args[1]}.`.yellow);
                                                let filename;
                                                if (args[1].endsWith('.mp3')) filename = args[1].toLowerCase().replace(/(\.mp3)+/g, '.mp3');
                                                else filename = args[1].toLowerCase() + '.mp3';
                                                files = userdb[mess.author.id].playlist;
                                                index = files.indexOf(`./${filename}`);
                                                //console.log(`./${filename}`);
                                                //console.log(userdb[mess.author.id].playlist);
                                                if(index > -1){
                                                        try {
                                                                userdb[mess.author.id].playlist.splice(index, 1);
                                                                if (userdb[mess.author.id].username != mess.author.username) userdb[mess.author.id].username = mess.author.username;
                                                                json = JSON.stringify(userdb, null, "\t");
                                                                fs.writeFileSync('./userdb.json', json, 'utf8');
                                                                console.log("  Asynchronous writing of the file " + "userdb.json".cyan + " is complete.");
                                                                fs.unlinkSync(`./${filename}`); 
                                                                console.log(`1. The file ${filename} has been successfully deleted from the file system.`.green); 
                                                                resolve(filename);
                                                        }
                                                        catch(error) { 
                                                                let embed = new Discord.MessageEmbed()
                                                                        .setColor('#FFD800')
                                                                        .setTitle('Something went wrong during your file deletion')
                                                                        .setDescription("Please try again. If it keeps happening and you don't understand why, contact <@643129279298928641> for help.")
                                                                        .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLUmOjIw2rX836oBzGOvftmUoCs6-YsdWt81LxpbJsw6WDbsf8oVBwmf3yBmASJVHuA_le1D5rfF3u4T-j6hU5yBY1GgNLGzv7QBSLcWJXt3desurGOoPTbl77nVzll8JdrRxrlFdEF_0q7ueC20T8F6=w249-h220-no');
                                                                mess.channel.send(embed);
                                                                reject(`User ${mess.author.username} has tried to delete a file named ${filename} but something went wrong:\n${error}`); 
                                                        }
                                                }
                                                else mess.channel.send("Couldn't find a file with that name. If not sure, please type `c!tlmy` to see the list of your personal greetings.");
                                        }
                                        else {
                                                mess.channel.send("Please add the name of the file you want to delete. If not sure, please type `c!tlmy` to see the list of your personal greeting files.");
                                                reject("They did not tell me the name of the file though...");
                                        }
                                }
                                else {
                                        mess.channel.send("You don't have any personal greetings right now, there's nothing to delete!");
                                        reject("The user does't have any personal greetings right now.");
                                }
                        }
                        else {
                                mess.channel.send("You don't have any personal greetings yet, there's nothing to delete!");
                                reject("The user does't have any personal greetings yet.");
                        }
                });
        }

        const dltMain = async () => {
                await removeFiles().then(async (filename) => {
                        await gitHubRemove(filename).then(async () => {
                                await gitHubUpload('./userdb.json', mess)
                                .then(() => {
                                        mess.channel.send("File `" + filename + "` has been successfully removed from your personal greetings.");
                                        console.log(`3. The file ${filename} has been successfully removed from GitHub.`.green); 
                                }).catch(error => {
                                        console.log(`3. Failed to upload the file`.red, `./userdb.json`.cyan, `to GitHub.\n${error}`.red);
                                })
                        }).catch(error => {
                                console.log(`2. Failed to remove the file from GitHub.\n${error}`.red);
                        })
                }).catch(error => {
                        console.log(`1. Failed to delete the file from the file system.\n${error}`.red);
                })
        }

        dltMain();
}

function test (bot, mess, args) {

}


var comms_list = [
        {name: "stop", out: stop, about: "Stops the bot"},
        {name: "play", out: play, about: "Plays CumZone"},
        {name: "playme", out: playme, about: "Plays a personal greeting"},
        {name: "help", out: help, about: "Sends the help message"},
        {name: "tracklist", out: tracklist, about: "Sends the tracklist"},
        {name: "tl", out: tracklist, about: "Sends the tracklist"},
        {name: "tlmy", out: tlmy, about: "Sends a personal tracklist of a user"},
        {name: "mytl", out: tlmy, about: "Sends a personal tracklist of a user"},
        {name: "add", out: add, about: "Adds a new personal greeting"},
        {name: "delete", out: dlt, about: "Deletes a personal greeting"},
        {name: "del", out: dlt, about: "Deletes a personal greeting"},
        {name: "test", out: test, about: "Test"}
]

module.exports.comms = comms_list;