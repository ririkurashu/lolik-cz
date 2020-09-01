const config = require('./botconfig.json'); 
const Discord = require('discord.js'); 
const prefix = config.prefix;

async function stop (bot, mess, args) 
{
        if(mess.author.id != "643129279298928641") return mess.channel.send("сосеш")
        else {
                await mess.channel.send("выключаемо");
                process.exit();
        }
}

function play (bot, mess, args) {
        var voiceChannel = mess.member.voice.channel;
	voiceChannel.join().then(connection =>{
		const dispatcher = connection.play('./cumzone.mp3');
		dispatcher.on("end", end => {
			voiceChannel.leave();
		});
	}).catch(err => console.log(err));
}

// Список комманд //

var comms_list = [
        {name: "stop", out: stop, about: "Stops CumZone"},
        {name: "play", out: play, about: "Plays CumZone"}
]

module.exports.comms = comms_list;