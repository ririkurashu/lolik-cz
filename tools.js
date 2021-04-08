const config = require('./botconfig.json'); 
const Discord = require('discord.js'); 
const prefix = config.prefix;

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
    greeting: function(mem){
        if(mem.voice.channel.permissionsFor(mem.client.user).has("CONNECT") && mem.voice.channel.permissionsFor(mem.client.user).has("SPEAK")){
            switch(mem.user.id){
                case "311230924031524865": // Марк
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        if(gacha(0.1)) {
                            var playList = ['./yaebu.apr1.secret.mp3', './waidmannsheil.apr1.secret.mp3', './jevachka.apr1.secret.mp3'];
                            const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                            dispatcher.on('finish', () => voiceChannel.leave());
                        }
                        else {
                            var playList = ['./yaebu.mp3', './waidmannsheil.mp3'];
                            const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                            dispatcher.on('finish', () => voiceChannel.leave());
                        }
                    }).catch(err => console.log(err));
                    break;

                case "659824944275783701": // Марк 2
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        if(gacha(0.1)) {
                            var playList = ['./yaebu.apr1.secret.mp3', './waidmannsheil.apr1.secret.mp3', './jevachka.apr1.secret.mp3'];
                            const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                            dispatcher.on('finish', () => voiceChannel.leave());
                        }
                        else {
                            var playList = ['./yaebu.mp3', './waidmannsheil.mp3'];
                            const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                            dispatcher.on('finish', () => voiceChannel.leave());
                        }
                    }).catch(err => console.log(err));
                    break;

                case "298158176824459265": // РоманГ
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./amongfartplus.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                case "295248007807369228": // Пашок
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./zvonitotec.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;
                
                case "151737968669753344": // Зебра
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./deadinside.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                case "704279535780233326": // РомиК
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./pekohello.secret.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;
                
                case "338635038583422977": // Аня Марк
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./papich.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;
                
                case "239101440256245762": // Колян
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./gatsu.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                case "436212253058924555": // Аня Пашок
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./sugarcrush.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;
                
                case "481411339156455425": // Полина
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        var playList = ['./samurai.mp3', './devochkanoch.mp3'];
                        const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                case "294101848389058562": // Егор
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./pososi.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                case "643129279298928641": // я
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./supachatto.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                /*
                case " ": // рандом
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        var playList = ['./zvonitotec.mp3', './jevachka.mp3', './deadinside.mp3'];
                        const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;
                */
                
                /*
                case " ": // гача
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        if(gacha(0.3)) {
                            const dispatcher = connection.play('./brasilhomebox.secret.mp3');
                            dispatcher.on('finish', () => voiceChannel.leave());
                        }
                        else {
                            const dispatcher = connection.play('./sayso.mp3');
                            dispatcher.on('finish', () => voiceChannel.leave());
                        }
                    }).catch(err => console.log(err));
                    break;
                */
                
                default:
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./cumzone.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
            }
        }
        else console.log("The bot doesn't have a permission to join and/or speak in", mem.voice.channel.name, "channel");
    }
}