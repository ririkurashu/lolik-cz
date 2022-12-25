const config = require('./botconfig.json'); 
const Discord = require('discord.js'); 
const prefix = config.prefix;
const userdb = require('./userdb.json');

function getRdmInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function gacha(coeff) {
    if(Math.random() < coeff) return 1;
    else return 0;
}

module.exports = {
    greeting: function(mem) {
        if(mem.voice.channel.permissionsFor(mem.client.user).has("CONNECT") && mem.voice.channel.permissionsFor(mem.client.user).has("SPEAK")) {
            var voiceChannel = mem.voice.channel;
            voiceChannel.join().then(connection => {
                if (mem.user.id in userdb) {
                    if (userdb[mem.user.id].playlist.length > 0) {
                        try {
                            var pl = userdb[mem.user.id].playlist;
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
            
            /*if(mem.user.id in userdb)
            {
                var voiceChannel = mem.voice.channel;
                voiceChannel.join().then(connection => {
                    var playList = userdb[mem.user.id].playlist;
                    if(playList.length > 1)
                    {
                        const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }
                    else
                    {
                        const dispatcher = connection.play(playList(0));
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }
                }).catch(err => console.log(err));
            }
            else
            {
                var voiceChannel = mem.voice.channel;
                voiceChannel.join().then(connection => {
                    const dispatcher = connection.play('./cumzone.mp3');
                    dispatcher.on('finish', () => voiceChannel.leave());
                }).catch(err => console.log(err));
            }*/
        }
        else console.log("The bot doesn't have a permission to join and/or speak in channel " + mem.voice.channel.name + " on server " + mem.guild.name + ".");
    },
    greetingRare: function(mem) {
        var voiceChannel = mem.voice.channel;
        try{
            voiceChannel.join().then(connection => {
                var playList = ['./lolkonfa1.secret.mp3', './lolkonfa2.secret.mp3'];
                const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                dispatcher.on('finish', () => voiceChannel.leave());
            }).catch(err => console.log(err));
        } catch (e) {
            console.log(e);
        };
    }
}