const config = require('./botconfig.json');
const tools = require("./tools.js");
var find = require('find');
const Discord = require('discord.js'); 
const prefix = config.prefix;

async function stop (bot, mess, args) 
{
        if(mess.author.id != "643129279298928641") return mess.channel.send("сосеш")
        else{
                await mess.channel.send("выключаю");
                process.exit();
        }
}

function play (bot, mess, args) {
        if(mess.member.voice.channel)
        {
                if(mess.member.voice.channel.permissionsFor(mess.member.client.user).has("CONNECT") && mess.member.voice.channel.permissionsFor(mess.member.client.user).has("SPEAK")){
                        var voiceChannel = mess.member.voice.channel;
                        var files = find.fileSync(/\.mp3$/, __dirname);
                        for(i = 0; i < files.length; i++){
                                files[i] = files[i].slice(files[i].lastIndexOf("\\") + 1, files[i].lastIndexOf(".mp3"));
                        }
                        if(args[1] && files.indexOf(args[1]) > -1){
                                voiceChannel.join().then(connection => {
                                        const dispatcher = connection.play(`./${args[1]}.mp3`);
                                        dispatcher.on('finish', () => voiceChannel.leave());
                                }).catch(err => console.log(err));
                        }
                        else{
                                voiceChannel.join().then(connection => {
                                        const dispatcher = connection.play('./cumzone.mp3');
                                        dispatcher.on('finish', () => voiceChannel.leave());
                                }).catch(err => console.log(err));
                        }
                }
        }
        else mess.channel.send("Чтобы эта команда работала, вы должны находиться в войсчате.");
}

function playme (bot, mess, args) {
        if(mess.member.voice.channel)
        {
                tools.greeting(mess.member);
        }
        else mess.channel.send("Чтобы эта команда работала, вы должны находиться в войсчате.");
}

function help (bot, mess, args) {
        find.file(/\.mp3$/, __dirname, function(files) {
                mp3files = "";
                for(i = 0; i < files.length; i++){
                        mp3files += "\n`" + files[i].slice(files[i].lastIndexOf("\\") + 1, files[i].lastIndexOf(".mp3")) + "`";
                }
                mess.channel.send("**Команды бота:**\n`cz!play` — приглашает вас в зону кончания.\n`cz!play <название>` — проигрывает конкретный файл приветствия. Cписок названий всех файлов - ниже.\n`cz!playme` — проигрывает ваше персональное приветствие.\n\nДоступные музыкальные файлы:" + mp3files);
        })
}

var comms_list = [
        {name: "stop", out: stop, about: "Stops the bot"},
        {name: "play", out: play, about: "Plays CumZone"},
        {name: "playme", out: playme, about: "Plays a personal greeting"},
        {name: "help", out: help, about: "Sends the help message"}
]

module.exports.comms = comms_list;