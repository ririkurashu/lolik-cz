//let config = require('./botconfig.json');
//const aws = require('aws-sdk');
let config = {
	botToken: process.env.REACT_APP_BOT_TOKEN,
	gitToken: process.env.REACT_APP_GIT_TOKEN,
	prefix: "c!"
};
const Discord = require('discord.js'); 
const djsv = require('@discordjs/voice');
const prefix = config.prefix;
const userdb = require('./userdb.json');

function getRdmInt (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function gacha (coeff) {
    if(Math.random() < coeff) return 1;
    else return 0;
}

function gachaPlus (coeffArr) {
    var r = Math.random();
    var coeffSum = 0;
    for (i = 0; i < coeffArr.length; i++) {
        coeffSum += coeffArr[i];
        if (r <= coeffSum) return i;
    }
    return 69;
}

module.exports = {
    greeting: function(mem) {
        delete require.cache [ require.resolve('./userdb.json') ];
        const userdb = require('./userdb.json');
        if(mem.voice.channel.permissionsFor(mem.client.user).has("CONNECT") && mem.voice.channel.permissionsFor(mem.client.user).has("SPEAK")) {
            try {
                const connection = djsv.joinVoiceChannel({
                    channelId: mem.voice.channelId,
                    guildId: mem.voice.channel.guild.id,
                    adapterCreator: mem.voice.channel.guild.voiceAdapterCreator,
                });
                if (mem.user.id in userdb) {
                    if (Object.keys(userdb[mem.user.id].playlist).length > 0) {
                        try {
                            var pl = Object.keys(userdb[mem.user.id].playlist);
                            var coeffArr = [];
                            var nameArr = [];
                            var restArr = [];
                            for (i = 0; i < pl.length; i++) {
                                if ("chance" in userdb[mem.user.id].playlist[pl[i]]) {
                                    coeffArr.push(userdb[mem.user.id].playlist[pl[i]].chance);
                                    nameArr.push(pl[i]);
                                }
                                else restArr.push(pl[i]);
                            }
                            var track = "";
                            if (coeffArr.length > 0) {
                                var num = gachaPlus(coeffArr);
                                //console.log(num);
                                if (num < 69) track = nameArr[num];
                                else track = restArr[getRdmInt(0, restArr.length)];
                            }
                            else track = restArr[getRdmInt(0, restArr.length)];
                            //console.log(track);
                            track = track.slice(1, track.length);
                        } catch (e) {
                            console.log(e);
                            var track = '/cumzone.mp3';
                        }
                    }
                    else var track = '/cumzone.mp3';
                }
                else var track = '/cumzone.mp3';
                //console.log((__dirname + track).toString());
                let resource = djsv.createAudioResource(__dirname + track);
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

            /*
            var voiceChannel = mem.voice.channel;
            voiceChannel.join().then(connection => {
                if (mem.user.id in userdb) {
                    if (Object.keys(userdb[mem.user.id].playlist).length > 0) {
                        try {
                            var pl = Object.keys(userdb[mem.user.id].playlist);
                        } catch (e) {
                            var pl = ['./cumzone.mp3'];
                        }
                    }
                    else var pl = ['./cumzone.mp3'];
                }
                else var pl = ['./cumzone.mp3'];
                const dispatcher = connection.play(pl[getRdmInt(0, pl.length)]);
                dispatcher.on('finish', () => voiceChannel.leave());
            }).catch(err => console.log(err));
            */
        }
        else console.log("The bot doesn't have a permission to join and/or speak in channel " + mem.voice.channel.name + " on server " + mem.guild.name + ".");
    },
    greetingRare: function (mem) {
        if(mem.voice.channel.permissionsFor(mem.client.user).has("CONNECT") && mem.voice.channel.permissionsFor(mem.client.user).has("SPEAK")) {
            try {
                const connection = djsv.joinVoiceChannel({
                    channelId: mem.voice.channelId,
                    guildId: mem.voice.channel.guild.id,
                    adapterCreator: mem.voice.channel.guild.voiceAdapterCreator,
                });
                let playList = ['/lolkonfa1.secret.mp3', '/lolkonfa2.secret.mp3'];
                let resource = djsv.createAudioResource(__dirname + playList[getRdmInt(0, playList.length)]);
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
        else console.log("The bot doesn't have a permission to join and/or speak in channel " + mem.voice.channel.name + " on server " + mem.guild.name + ".");
    },
    greetingQuaso: function (mem) {
        if(mem.voice.channel.permissionsFor(mem.client.user).has("CONNECT") && mem.voice.channel.permissionsFor(mem.client.user).has("SPEAK")) {
            try {
                const connection = djsv.joinVoiceChannel({
                    channelId: mem.voice.channelId,
                    guildId: mem.voice.channel.guild.id,
                    adapterCreator: mem.voice.channel.guild.voiceAdapterCreator,
                });
                let playList = ['/quaso1.mp3', '/quaso2.mp3', '/quaso3.mp3'];
                let resource = djsv.createAudioResource(__dirname + playList[getRdmInt(0, playList.length)]);
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
        else console.log("The bot doesn't have a permission to join and/or speak in channel " + mem.voice.channel.name + " on server " + mem.guild.name + ".");
    }
}