//import config from './botconfig.json';
//import aws from 'aws-sdk';
let config = {
	botToken: process.env.REACT_APP_BOT_TOKEN,
	gitToken: process.env.REACT_APP_GIT_TOKEN,
	prefix: "c!"
};
import tools from "./tools.js";
import fs from 'fs';
import userdb from './userdb.json' assert { type: "json" };
import Discord from 'discord.js'; 
import * as djsv from '@discordjs/voice';
const prefix = config.prefix;
let token = config.gitToken;

import Axios from 'axios';
import colors from 'colors';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
        auth: token
});

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function stop (bot, mess, args) 
{
        if(mess.author.id != "643129279298928641") return mess.channel.send({ content: "You don't have permission to stop me!" })
        else{
                await mess.channel.send({ content: "The bot is turning off..." });
                process.exit();
        }
}

function play (bot, mess, args) {
        if (mess.channel.type == "GUILD_TEXT") {
                if(mess.member.voice.channel) {
                        if(mess.member.voice.channel.permissionsFor(mess.member.client.user).has("CONNECT") && mess.member.voice.channel.permissionsFor(mess.member.client.user).has("SPEAK")){
                                var voiceChannel = mess.member.voice.channel;
                                if(args[1]) {
                                        if (args[1].endsWith('.mp3')) args[1] = args[1].slice(0, args[1].lastIndexOf(".mp3"));
                                        var files = fs.readdirSync("./");
                                        for(let i = 0; i < files.length; i++) {
                                                if(files[i].indexOf(".mp3") == -1 || files[i].indexOf(".mp3.sfk") > -1) {
                                                        files.splice(i, 1);
                                                        i--;
                                                }
                                                else files[i] = files[i].slice(0, files[i].lastIndexOf(".mp3"));
                                        }
                                        if(files.indexOf(args[1].toLowerCase()) > -1) {
                                                try {
                                                        const connection = djsv.joinVoiceChannel({
                                                                channelId: mess.member.voice.channelId,
                                                                guildId: mess.member.voice.channel.guild.id,
                                                                adapterCreator: mess.member.voice.channel.guild.voiceAdapterCreator,
                                                        });
                                                        let resource = djsv.createAudioResource(__dirname + "/" + args[1].toLowerCase() + ".mp3");
                                                        const player = djsv.createAudioPlayer();
                                                        connection.subscribe(player);
                                                        player.play(resource);
                                                        player.on(djsv.AudioPlayerStatus.Idle, () => {
                                                                connection.destroy();
                                                        });
                                                        player.on('error', error => {
                                                                console.error(error);
                                                        });
                                                }
                                                catch (e) { console.log(e) };
                                        }
                                        else mess.channel.send({ content: "Couldn't find a file with that name.\nIf not sure, please type `c!tracklist` and check the list." });
                                }
                                else {
                                        try {
                                                const connection = djsv.joinVoiceChannel({
                                                        channelId: mess.member.voice.channelId,
                                                        guildId: mess.member.voice.channel.guild.id,
                                                        adapterCreator: mess.member.voice.channel.guild.voiceAdapterCreator,
                                                });
                                                let resource = djsv.createAudioResource(__dirname + '/cumzone.mp3');
                                                const player = djsv.createAudioPlayer();
                                                connection.subscribe(player);
                                                player.play(resource);
                                                player.on(djsv.AudioPlayerStatus.Idle, () => {
                                                        connection.destroy();
                                                });
                                                player.on('error', error => {
                                                        console.error(error);
                                                });
                                        }
                                        catch (e) { console.log(e) };
                                }
                        }
                        else mess.channel.send({ content: "I don't have a permission to connect to your current voice channel. Please try another one or ask the server admin to give me a permission!" });
                }
                else mess.channel.send({ content: "For that command to work, you need to be in a voice channel." });
        }
        else mess.channel.send({ content: "Unfortunately, this command doesn't seem to work here. Try typing it in a server text channel where I have permission to read it!" });
}

function playme (bot, mess, args) {
        if (mess.channel.type == "GUILD_TEXT") {
                if(mess.member.voice.channel) {
                        if(mess.member.voice.channel.permissionsFor(mess.member.client.user).has("CONNECT") && mess.member.voice.channel.permissionsFor(mess.member.client.user).has("SPEAK")) {
                                tools.greeting(mess.member); 
                        }
                        else mess.channel.send({ content: "I don't have a permission to connect to your current voice channel. Please try another one or ask the server admin to give me a permission!" });
                }
                else mess.channel.send({ content: "For that command to work, you need to be in a voice chat." });
        }
        else mess.channel.send({ content: "Unfortunately, this command doesn't seem to work here. Try typing it in a server text channel where I have permission to read it!" });
}

function help (bot, mess, args) {
        let embed = new Discord.MessageEmbed()
                .setColor('#FFD800')
                .setTitle('Bot commands')
                .addField('\u200B', '**Overall commands**')
                .addFields(
                        { name: '\tc!play', value: 'Welcomes you to the cum zone' },
                        { name: 'c!play <trackname>', value: 'Plays a certain music file by its name' },
                        { name: 'c!playme', value: 'Plays one of your personal greetings' },
                        { name: 'c!tracklist', value: 'Shows the full list of mp3 track names' },
                        { name: 'c!tlmy', value: 'Shows the list of your personal mp3 track names' }
                )
                .addField('\u200B', '**DM only commands**')
                .addFields(
                        { name: 'c!add', value: 'Adds a file to your personal greetings' },
                        { name: 'c!delete', value: 'Removes a file from your personal greetings' },
                        { name: 'c!rates', value: 'Sets the play rates of your music files' }
                )
                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLXEzTKb29OCSxvrjsqu1RY9_DTna6T9NluIXp7eXeyZ1uaurTPzVeuJdQSfJrrvC2sF5aj58GJ8NbduPm0ppSuL3PakkBvZaz17MsXtLo80Y5MVZQrUchaMAdzGgsnrmyuDKsmQvOyP7zhG24TRHVfT=s216-no');
        mess.channel.send({ embeds: [embed] });
        //mess.channel.send({ content: "**Bot commands:**\n`c!play` — welcomes you to the cum zone.\n`c!play <trackname>` — plays a certain music file.
        //\n`c!tracklist` — shows the full list of mp3 track names.\n`c!playme` — plays your personal greeting." });
}

function tracklist (bot, mess, args) {
        let mp3files = [];
        var files = fs.readdirSync("./");
        for(let i = 0; i < files.length; i++){
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
                        { name: '\u200B', value: mp3files.slice(0, third).join('\n'), inline: true  },
                        { name: '\u200B', value: mp3files.slice(third, third * 2).join('\n'), inline: true },
                        { name: '\u200B', value: mp3files.slice(third * 2).join('\n'), inline: true },
                )
                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLVX4XmndLLx-5fkLnc4JfZZfhb4_YVv4SHSTxUOOVVnTycCe8kun5VAu_tymUD6eXG-o1qr2luVDZBZH_yYyfqv8E8K8Lmd2QxrpqNpWnGicezdN7BrEh8vlC41bJh_zh1MG0llAKUmgBQJCXBCdBkN=w296-h270-no');
        mess.channel.send({ embeds: [embed] });
}

function tlmy (bot, mess, args) {
        const userdb = fs.readFileSync('./userdb.json', 'utf8');
        if (mess.author.id in userdb) {
                if (userdb[mess.author.id].username != mess.author.username) userdb[mess.author.id].username = mess.author.username;
                if (Object.keys(userdb[mess.author.id].playlist).length > 0) {
                        let files = Object.keys(userdb[mess.author.id].playlist).slice();
                        var list = "";
                        var rates = "";
                        var secret = 0;
                        for (let i = 0; i < files.length; i++) {
                                if(files[i].endsWith(".secret.mp3") && mess.channel.type != "DM") secret++;
                                else {
                                        list += files[i].slice(2) + "\n";
                                        if ("chance" in userdb[mess.author.id].playlist[files[i]]) rates += userdb[mess.author.id].playlist[files[i]].chance * 100 + "%\n";
                                        else rates += "No rate\n"
                                }
                        }
                        if (secret > 0) list += `_+${secret} more track(s)_`;
                        let embed = new Discord.MessageEmbed()
                                .setColor('#FFD800')
                                .setTitle(mess.author.username + '\'s personal greeting files')
                                .addFields(
                                        { name: 'Name', value: list, inline: true  },
                                        { name: 'Play rate', value: rates, inline: true }
                                )
                                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLVX4XmndLLx-5fkLnc4JfZZfhb4_YVv4SHSTxUOOVVnTycCe8kun5VAu_tymUD6eXG-o1qr2luVDZBZH_yYyfqv8E8K8Lmd2QxrpqNpWnGicezdN7BrEh8vlC41bJh_zh1MG0llAKUmgBQJCXBCdBkN=w296-h270-no');
                        mess.channel.send({ embeds: [embed] });
                }
                else {
                        if (mess.channel.type == "DM") mess.channel.send({ content: "Your personal tracklist is empty. Type `c!add` with a .mp3 file attached if you want to set a new greeting!" });
                        else mess.channel.send({ content: "Your personal tracklist is empty. DM me with `c!add` and a .mp3 file attached if you want to set a new greeting!" });
                }
        }
        else {
                if (mess.channel.type == "DM") mess.channel.send({ content: "It seems like you don't have any personal greetings yet. Type `c!add` with a .mp3 file attached if you want to get one!" });
                else mess.channel.send({ content: "It seems like you don't have any personal greetings yet. DM me with `c!add` and a .mp3 file attached if you want to get one!" });
        }
}

// GitHub uploading function for "add" and "dlt"

const gitHubUpload = async (path, mess) => {
        try {
                let content = fs.readFileSync(path, 'base64');
                /*try { fs.writeFileSync('./1111.mp3', content); }
                catch (e) { console.log(e); };*/
                console.log(`  The file ${path.slice(2)} has been successfully read and is about to be sent to the GitHub repo.`.yellow);
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
                console.log("  Upload of", `${path.slice(2)}`.cyan, "to GitHub failed, deleting files...\n");
                try {
                        fs.unlinkSync(path);
                        delete userdb[mess.author.id].playlist[path];
                        let json = JSON.stringify(userdb, null, "\t");
                        fs.writeFile('./userdb.json', json, 'utf8', function(error) {
                                if(error) {
                                        console.log(`  Couldn't remove ${path.slice(2)} from .json.\n${error}`.red);
                                        return new Promise ((resolve, reject) => reject(err));
                                }
                        });
                }
                catch (error) { console.log(`  Couldn't remove files.\n${error}`.red); }
                finally { return new Promise ((resolve, reject) => reject(err)); };
        }
}

// i hate this from the bottom of my heart
function add (bot, mess, args) {
        const userdb = fs.readFileSync('./userdb.json', 'utf8');
        if (mess.channel.type == "DM") {
                if (mess.author.bot) return;
                if (mess.author.id in userdb) if (Object.keys(userdb[mess.author.id].playlist).length >= 4) return mess.channel.send({ content: "Your tracklist is too huge! Please delete some of your files before adding any new ones." });
                
                // json updating function

                const jsonUpdate = async path => {
                        try {
                                if (mess.author.id in userdb) {
                                        if (!(path in userdb[mess.author.id].playlist)) {
                                                userdb[mess.author.id].playlist[path] = { };
                                                if (userdb[mess.author.id].username != mess.author.username) userdb[mess.author.id].username = mess.author.username;
                                                let json = JSON.stringify(userdb, null, "\t");
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
                                                "playlist": {
                                                        [path]: { }
                                                }
                                        };
                                        let json = JSON.stringify(userdb, null, "\t");
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
                                        mess.channel.send({ content: "Your file needs to have a `.mp3` extension." });
                                        console.log("1. The file is not in .mp3 extension.".red);
                                        return new Promise((resolve, reject) => reject());
                                }
                                if (mess.attachments.first().size > 524288) { 
                                        mess.channel.send({ content: "Sorry, but your file must be 512 KB or less." });
                                        console.log("1. The file is too big.".red);
                                        return new Promise((resolve, reject) => reject());
                                }
                                let fileName = mess.attachments.first().name.toLowerCase().replace(/(\.mp3)+/g, '.mp3').replace(/[^a-zа-яё0-9\.]/g, '');
                                if (fileName.length > 16) {
                                        if (fileName.endsWith(".secret.mp3")) fileName = fileName.slice(0, 11) + '.secret.mp3';
                                        else fileName = fileName.slice(0, 12) + '.mp3';
                                }
                                if (fileName == '.mp3') fileName = Date.now() + fileName;
                                let path = './' + fileName;
                                if (mess.author.id in userdb) {
                                        var files = fs.readdirSync("./");
                                        if(files.indexOf(fileName) > -1 && !(path in userdb[mess.author.id].playlist)) {
                                                mess.channel.send({ content: "Sorry, but a file with that name already exists and belongs to someone else." });
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
                                                        //mess.channel.send({ content: "Your file has been successfully uploaded and added to your personal greetings!" });
                                                        await gitHubUpload(path, mess)
                                                        .then(async () => {
                                                                console.log("3.1. Successfully uploaded the file".green, `${path.slice(2)}`.cyan, "to GitHub.".green);
                                                                await gitHubUpload('./userdb.json', mess)
                                                                .then(() => {
                                                                        console.log("3.2. Successfully uploaded the file".green, './userdb.json'.cyan, "to GitHub.".green);
                                                                        mess.channel.send({ content: "Your file has been successfully uploaded and added to your personal greetings!" });
                                                                        fs.open('./logs.txt', 'a+', (err, fd) => {
                                                                                try {
                                                                                        let x = new Date();
                                                                                        let hoursDiff = x.getHours() + 3;
                                                                                        x.setHours(hoursDiff);
                                                                                        let logData = `[${x.toUTCString()}]: User ${mess.author.username} has ADDED the file named ${path.slice(2)}\n`;
                                                                                        fs.write(fd, logData, async () => {
                                                                                                await gitHubUpload('./logs.txt', mess)
                                                                                                .then(() => {
                                                                                                        console.log("3.3. Successfully uploaded the file".green, './logs.txt'.cyan, "to GitHub.".green);
                                                                                                        resolve();
                                                                                                }).catch(error => {
                                                                                                        console.log(`3.3. Failed to upload the file`.red, `./logs.txt`.cyan, `to GitHub.\n${error}`.red);
                                                                                                        reject();
                                                                                                });
                                                                                        })
                                                                                } catch (e) {
                                                                                        console.log("Error during log updating:\n", e)
                                                                                } finally {
                                                                                        fs.close(fd, (err) => {
                                                                                                if (err) throw err;
                                                                                        });
                                                                                }
                                                                        });
                                                                }).catch(error => {
                                                                        console.log(`3.2. Failed to upload the file`.red, `./userdb.json`.cyan, `to GitHub.\n${error}`.red);
                                                                        reject();
                                                                });
                                                        }).catch(error => {
                                                                console.log(`3.1. Failed to upload the file`.red, `${path.slice(2)}`.cyan, `to GitHub.\n${error}`.red);
                                                                reject();
                                                        });
                                                }).catch(error => {
                                                        console.log(`2. Failed to rewrite .json file.\n${error}`.red);
                                                        reject();
                                                });
                                        });
                                        writer.on('error', (error) => {
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
                                mess.channel.send({ embeds: [embed] });
                        });
                };
                

                if (!mess.attachments.first()) {
                        let embed = new Discord.MessageEmbed()
                                .setColor('#FFD800')
                                .setTitle('Please send me a file you want to add to your greetings')
                                .setDescription("While preparing the file, please note that:\n•  it must be in **.mp3** extension;\n•  it must be **512 KB** or less.\nOtherwise, the file won't be accepted.\nBesides that, it's also highly recommended that:\n•  the file duration be shorter than **10 seconds**;\n•  the file volume be under **12 dB** (as shown in the picture on the right).\nPlease respect yourself and the others.\n\n**NOTE:\n1. You can now adjust your tracks' chances to play using `c!rates` command.\n2. The bot's synchronization will have to work through an experimental method for a while, so unexpected errors may occur. Please contact <@643129279298928641> if something goes wrong.**")
                                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLWg9NRc93lE50rac7OaX70sMUhvWOAoLmslr7J4UYbteXpNKemTBNTlAQpKfFBXRATLLORVO3hOwpt-RO8auLW_Kj8Rdh6vkdU1hLWc29Os_k7XRJ7wVARvIxgvRmlz0tbJ0aYbAqBIcOYnYypfaLzc=w53-h68-no');
                        mess.channel.send({ embeds: [embed] });
                        const filter = m => m.attachments.first();
                        mess.channel.awaitMessages({ filter,  max: 1, time: 90000, errors: ['time'] })
                        .then((collected) => {
                                mess = collected.first();
                                console.log(`\nUser ${mess.author.username} tries to add a file named ${mess.attachments.first().name}.`.yellow);
                                download(mess.attachments.first().url);
                        })
                        .catch((collected) => {
                                mess.channel.send({ content: "Looks like you haven't sent me the file for too long. Try again with `c!add` when you feel like it!" });
                                console.log(`The user ${mess.author.username} typed me with c!add but has't sent me the file for too long.`);
                        });
                }
                else {
                        console.log(`\nUser ${mess.author.username} tries to add a file named ${mess.attachments.first().name}.`.yellow);
                        download(mess.attachments.first().url);
                }
        }
        else mess.channel.send({ content: "Let's not spam this channel and let no one interrupt us.\nSend me a direct message with this command!" });
}

function dlt (bot, mess, args) {
        const userdb = fs.readFileSync('./userdb.json', 'utf8');
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
                        mess.channel.send({ embeds: [embed] });
                        return new Promise ((resolve, reject) => reject(error)); 
                }
        }
        
        const removeFiles = async () => {
                return new Promise((resolve, reject) => {
                        if (mess.author.id in userdb) {
                                if (Object.keys(userdb[mess.author.id].playlist).length > 0) {
                                        if(args[1]) {
                                                console.log(`\nUser ${mess.author.username} tries to delete a file named ${args[1]}.`.yellow);
                                                let filename;
                                                if (args[1].endsWith('.mp3')) filename = args[1].toLowerCase().replace(/(\.mp3)+/g, '.mp3');
                                                else filename = args[1].toLowerCase() + '.mp3';
                                                let files = Object.keys(userdb[mess.author.id].playlist);
                                                let index = files.indexOf(`./${filename}`);
                                                //console.log(`./${filename}`);
                                                //console.log(Object.keys(userdb[mess.author.id].playlist));
                                                if(index > -1){
                                                        try {
                                                                delete userdb[mess.author.id].playlist[`./${filename}`];
                                                                let files = Object.keys(userdb[mess.author.id].playlist);
                                                                var count = 0;
                                                                for (let i = 0; i < files.length; i++) {
                                                                        if ("chance" in userdb[mess.author.id].playlist[files[i]]) count++;
                                                                }
                                                                console.log(`count = ${count}, length = ${files.length}`);
                                                                if (count == files.length) for (let i = 0; i < files.length; i++) {
                                                                        userdb[mess.author.id].playlist[files[i]] = {};
                                                                }
                                                                if (userdb[mess.author.id].username != mess.author.username) userdb[mess.author.id].username = mess.author.username;
                                                                let json = JSON.stringify(userdb, null, "\t");
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
                                                                mess.channel.send({ embeds: [embed] });
                                                                reject(`User ${mess.author.username} has tried to delete a file named ${filename} but something went wrong:\n${error}`); 
                                                        }
                                                }
                                                else mess.channel.send({ content: "Couldn't find a file with that name. If not sure, please type `c!tlmy` to see the list of your personal greetings." });
                                        }
                                        else {
                                                mess.channel.send({ content: "Please add the name of the file you want to delete. If not sure, please type `c!tlmy` to see the list of your personal greeting files." });
                                                reject("They did not tell me the name of the file though...");
                                        }
                                }
                                else {
                                        mess.channel.send({ content: "You don't have any personal greetings right now, there's nothing to delete!" });
                                        reject("The user does't have any personal greetings right now.");
                                }
                        }
                        else {
                                mess.channel.send({ content: "You don't have any personal greetings yet, there's nothing to delete!" });
                                reject("The user does't have any personal greetings yet.");
                        }
                });
        }

        const dltMain = async () => {
                await removeFiles().then(async (filename) => {
                        await gitHubRemove(filename).then(async () => {
                                await gitHubUpload('./userdb.json', mess)
                                .then(() => {
                                        mess.channel.send({ content:  "File `" + filename + "` has been successfully removed from your personal greetings." });
                                        console.log(`3. The file ${filename} has been successfully removed from GitHub.`.green); 
                                        fs.open('./logs.txt', 'a+', (err, fd) => {
                                                try {
                                                        let x = new Date();
                                                        let hoursDiff = x.getHours() + 3;
                                                        x.setHours(hoursDiff);
                                                        let logData = `[${x.toUTCString()}]: User ${mess.author.username} has DELETED the file named ${filename}\n`;
                                                        fs.write(fd, logData, async () => {
                                                                await gitHubUpload('./logs.txt', mess)
                                                                .then(() => {
                                                                        console.log("3.3. Successfully uploaded the file".green, './logs.txt'.cyan, "to GitHub.".green);
                                                                }).catch(error => {
                                                                        console.log(`3.3. Failed to upload the file`.red, `./logs.txt`.cyan, `to GitHub.\n${error}`.red);
                                                                });
                                                        })
                                                } catch (e) {
                                                        console.log("Error during log updating:\n", e)
                                                } finally {
                                                        fs.close(fd, (err) => {
                                                                if (err) throw err;
                                                        });
                                                }
                                        });
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

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

function rates (bot, mess, args) {
        if (mess.channel.type == "DM") {
                const userdb = fs.readFileSync('./userdb.json', 'utf8');
                var filenames = Object.keys(userdb[mess.author.id].playlist);
                var plLength = filenames.length;
                if (mess.author.id in userdb && plLength > 0) {
                        if (plLength > 1) {
                                console.log(`\nUser ${mess.author.username} tries to set theiy playrates.`.yellow);
                                var list = "";
                                var rates = "";
                                for (let i = 0; i < plLength; i++) {
                                        list += filenames[i].slice(2) + "\n";
                                        if ("chance" in userdb[mess.author.id].playlist[filenames[i]]) rates += userdb[mess.author.id].playlist[filenames[i]].chance * 100 + "%\n";
                                        else rates += "No rate\n"
                                }
                                const embed = new Discord.MessageEmbed()
                                .setColor('#FFD800')
                                .setTitle("Adjust your files' play rates")
                                .setDescription("Please use the select menus below to change your .mp3 files' chances to be played, and then click the OK button to confirm your choice.\nThe `No rate` option means that the file's playrate equals 100% minus all the other rates. Therefore, at least one file's playrate must remain undefined.\n\n")
                                .addFields(
                                        { name: 'Your current tracklist with the rates:', value: list, inline: true  },
                                        { name: '\u200B', value: rates, inline: true }
                                )
                                .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLWLzPhstQJP8X7UU_rOWeeQ0S5y_a9F8wD5HIv4-XK-ATSkhrRIPRKdXjatAQk_aFRjYXOw-frkgWP28PMkzf-P3XDacW4g5uJ5uD267iAvupg9uwoR8IybSlV5S_SG8RBUAtIeca83FWnaU5IyLmLx=w320-h271-no?authuser=0');
                                
                                var row = new Array();
                                for (let i = 0; i < plLength; i++) {
                                        row[i] = new Discord.MessageActionRow()
                                        .addComponents(
                                                new Discord.MessageSelectMenu()
                                                .setCustomId(i.toString())
                                                .setPlaceholder(filenames[i].slice(2))
                                                .addOptions([
                                                        {
                                                                label: 'No rate',
                                                                value: "0",
                                                        },
                                                        {
                                                                label: '2%',
                                                                value: "0.02",
                                                        },
                                                        {
                                                                label: '5%',
                                                                value: "0.05",
                                                        },
                                                        {
                                                                label: '10%',
                                                                value: "0.1",
                                                        },
                                                        {
                                                                label: '20%',
                                                                value: "0.2",
                                                        }
                                                ])
                                                .setMinValues(1)
                                                .setMaxValues(1),
                                        );
                                }
                                row[plLength] = new Discord.MessageActionRow()
                                .addComponents(
                                        new Discord.MessageButton()
                                                .setCustomId('okButton')
                                                .setLabel('OK')
                                                .setStyle('PRIMARY'),
                                );
                                const filter = (interaction) =>
                                        (interaction.isSelectMenu() || interaction.isButton()) &&
                                        interaction.user.id == mess.author.id;
                                const collector = mess.channel.createMessageComponentCollector({ filter });
                                collector.on('collect', async (collected) => {
                                        //collected.deferUpdate(); // i honestly have no fucking clue what this does, englihs hard for me
                                        if (collected.componentType == 'SELECT_MENU') console.log("collected-success", collected.values[0]);
                        // STINKY - the bot might not collect the updated embed on time (already commented that part):
                                        else if (collected.componentType == 'BUTTON' /*&& (collected.message.embeds[0].title == "Let's go!!!" || collected.message.embeds[0].title == "No way!!!")*/) {
                                                console.log("collector closed");
                                                collector.stop();
                                        }
                                })
                                mess.channel.send({ embeds: [embed], components: row })
                                .then(async (sentMessage) => {
                                        embed.setTitle("Time's up!!!")
                                        .setDescription("Sorry, but you've been picking for too long.\nCall this command again if you steel need it.")
                                        .setFields()
                                        .setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLWVRJFaAyuPYwYpOnW3-EP8NuCrpkixRIQJ0a2vy7dVSEPobQ05NRCoD-koFX_LAuwu-GPXqzMVv_7-C-jxPNAl-SHMjD75V9m3iQv40tXL48gfBTatgzcmuB_qU5Hcf5e1gSZ_k1DOw6GFsFdbckG6=w320-h319-no?authuser=0');
                                        await sleep (90000);
                                        sentMessage.edit({ embeds: [embed], components: [] });
                                        collector.stop();
                                });
                        } else mess.channel.send({ content: "You need to have more than 1 music file in order to adjust rates." });
                } else mess.channel.send({ content: "It seems like you don't have any personal greetings yet. DM me with `c!add` and a .mp3 file attached if you want to get one!" });
        }
        else mess.channel.send({ content: "Let's not spam this channel and let no one interrupt us.\nSend me a direct message with this command!" });
}

function directory (bot, mess, args) {
        var files = fs.readdirSync("./");
        let third = Math.ceil(files.length / 3);
        let embed = new Discord.MessageEmbed()
                .setColor('#FFD800')
                .setTitle('Available music files')
                .addFields(
                        { name: '\u200B', value: files.slice(0, third).join('\n'), inline: true  },
                        { name: '\u200B', value: files.slice(third, third * 2).join('\n'), inline: true },
                        { name: '\u200B', value: files.slice(third * 2).join('\n'), inline: true },
                )
        mess.channel.send({ embeds: [embed] });
}

function test () { }

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
        {name: "rates", out: rates, about: "Allows to adjust the files' play rates"},
        {name: "directory", out: directory, about: "Allows to adjust the files' play rates"},
        /*{name: "add", out: blya, about: "Adds a new personal greeting"},
        {name: "delete", out: blya, about: "Deletes a personal greeting"},
        {name: "del", out: blya, about: "Deletes a personal greeting"},*/
        //{name: "test", out: test, about: "Test"}
]

export default { comms: comms_list };