const Discord = require('discord.js'); 
const bot = new Discord.Client();
const comms = require("./comms.js");
const fs = require('fs');
const { OpusEncoder } = require('@discordjs/opus');
let config = require('./botconfig.json');
const { Server } = require('http');
let token = config.token;
let prefix = config.prefix;

bot.on("ready", function(){
	console.log(bot.user.username + " launched successfully");
	console.log("https://discord.com/api/oauth2/authorize?client_id=749320971890196600&permissions=3148800&scope=bot");
});


bot.on("message", msg => {
	if(msg.author.username != bot.user.username && msg.author.discriminator != bot.user.discriminator){
    	var comm = msg.content.trim()+" ";
	    var ok = false;
	    var comm_name = comm.slice(0, comm.indexOf(" "));
	    var messArr = comm.split(" ");
	    for(comm_count in comms.comms){
	    	var comm2 = prefix + comms.comms[comm_count].name;
	    	if(comm2 == comm_name){
	    		comms.comms[comm_count].out(bot, msg, messArr);
	    	}
	    }
    } 
});


bot.on("voiceStateUpdate", async (oldState, newState) => {
	if(newState.member.user.username != bot.user.username && newState.member.user.discriminator != bot.user.discriminator && newState.channel != oldState.channel && newState.channel){
		console.log("<1337> User", newState.member.user.username, "has connected to the", newState.channel.name, "channel");
		if(newState.member.user.id == "311230924031524865" || newState.member.user.id == "659824944275783701"){
			var voiceChannel = newState.member.voice.channel;
			voiceChannel.join().then(connection =>{
				const dispatcher = connection.play('./jevachka.mp3');
				dispatcher.on('finish', () => voiceChannel.leave());
			}).catch(err => console.log(err));
		}
		else{
			var voiceChannel = newState.member.voice.channel;
			voiceChannel.join().then(connection =>{
				const dispatcher = connection.play('./cumzone.mp3');
				dispatcher.on('finish', () => voiceChannel.leave());
			}).catch(err => console.log(err));
		}
	}
})

bot.login(token);