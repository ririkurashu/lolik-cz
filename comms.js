const config = require('./botconfig.json');
const tools = require("./tools.js");
const fs = require('fs');
const Discord = require('discord.js'); 
const prefix = config.prefix;

async function stop (bot, mess, args) 
{
        if(mess.author.id != "643129279298928641") return mess.channel.send("You don't have permission to stop me!")
        else{
                await mess.channel.send("The bot is turning off...");
                process.exit();
        }
}

function play (bot, mess, args) {
        if (message.channel.type == "GUILD_TEXT") {
                if(mess.member.voice.channel) {
                        if(mess.member.voice.channel.permissionsFor(mess.member.client.user).has("CONNECT") && mess.member.voice.channel.permissionsFor(mess.member.client.user).has("SPEAK")){
                                var voiceChannel = mess.member.voice.channel;
                                if(args[1]) {
                                        var files = fs.readdirSync("./");
                                        for(i = 0; i < files.length; i++){
                                                if(files[i].indexOf(".mp3") == -1 || files[i].indexOf(".mp3.sfk") > -1) {
                                                        files.splice(i, 1);
                                                        i--;
                                                }
                                                else files[i] = files[i].slice(0, files[i].lastIndexOf(".mp3"));
                                        }
                                        if(files.indexOf(args[1].toLowerCase()) > -1){
                                                voiceChannel.join().then(connection => {
                                                        const dispatcher = connection.play(`./${args[1].toLowerCase()}.mp3`);
                                                        dispatcher.on('finish', () => voiceChannel.leave());
                                                }).catch(err => console.log(err));
                                        }
                                        else mess.channel.send("Couldn't find a file with that name.\nIf not sure, please type `cz!tracklist` and check the list.");
                                }
                                else {
                                        voiceChannel.join().then(connection => {
                                                const dispatcher = connection.play('./cumzone.mp3');
                                                dispatcher.on('finish', () => voiceChannel.leave());
                                        }).catch(err => console.log(err));
                                }
                        }
                }
                else mess.channel.send("For that command to work, you need to be in a voice channel.");
        }
        else mess.channel.send("Unfortunately, this command doesn't seem to work here.\nTry typing it in a server text channel where I have permission to read it!");
}

function playme (bot, mess, args) {
        if (message.channel.type == "GUILD_TEXT") {
                if(mess.member.voice.channel) {
                        tools.greeting(mess.member);
                }
                else mess.channel.send("For that command to work, you need to be in a voice chat.");
        }
        else mess.channel.send("Unfortunately, this command doesn't seem to work here.\nTry typing it in a server text channel where I have permission to read it!");
}

function help (bot, mess, args) {
        mess.channel.send("**Bot commands:**\n`cz!play` — welcomes you to the cum zone.\n`cz!play <trackname>` — plays a certain music file.\n`cz!tracklist` — shows the full list of mp3 track names.\n`cz!playme` — plays your personal greeting.");
}

function tracklist (bot, mess, args) {
        mp3files = "";
        var files = fs.readdirSync("./");
        for(i = 0; i < files.length; i++){
                if(files[i].indexOf(".mp3") == -1 || files[i].indexOf(".mp3.sfk") > -1 || files[i].indexOf(".secret") > -1) {
                        files.splice(i, 1);
                        i--;
                }
                else {
                        files[i] = files[i].slice(0, files[i].lastIndexOf(".mp3"));
                        mp3files += "\n`" + files[i] + "`";
                }
        }
        mess.channel.send("Available music files:" + mp3files);
}

var comms_list = [
        {name: "stop", out: stop, about: "Stops the bot"},
        {name: "play", out: play, about: "Plays CumZone"},
        {name: "playme", out: playme, about: "Plays a personal greeting"},
        {name: "help", out: help, about: "Sends the help message"},
        {name: "tracklist", out: tracklist, about: "Sends the tracklist"}
]

module.exports.comms = comms_list;