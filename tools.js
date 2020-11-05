const config = require('./botconfig.json'); 
const Discord = require('discord.js'); 
const prefix = config.prefix;

function getRdmInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

module.exports = {
    greeting: function (mem) {
        if(mem.voice.channel.permissionsFor(mem.client.user).has("CONNECT") && mem.voice.channel.permissionsFor(mem.client.user).has("SPEAK")){
            switch(mem.user.id){
                case "311230924031524865": // Марк
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./jevachka.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                case "659824944275783701": // Марк 2
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./jevachka.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                case "298158176824459265": // РоманГ
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./blackbox.mp3');
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
                        const dispatcher = connection.play('./ghostrule.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;
                
                case "338635038583422977": // Аня
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./papich.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;
                
                case "239101440256245762": // Колян
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        const dispatcher = connection.play('./musette.mp3');
                        dispatcher.on('finish', () => voiceChannel.leave());
                    }).catch(err => console.log(err));
                    break;

                /*
                case "643129279298928641": // я
                    var voiceChannel = mem.voice.channel;
                    voiceChannel.join().then(connection => {
                        var playList = ['./zvonitotec.mp3', './jevachka.mp3', './deadinside.mp3']
                        const dispatcher = connection.play(playList[getRdmInt(0, playList.length - 1)]);
                        dispatcher.on('finish', () => voiceChannel.leave());
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