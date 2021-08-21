const Discord = require('discord.js'); 
const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES] });
const comms = require("./comms.js");
const tools = require("./tools.js");
const fs = require('fs');
const { OpusEncoder } = require('@discordjs/opus');
let config = require('./botconfig.json');
const { Server } = require('http');
const colors = require('colors');
let token = config.botToken;
let prefix = config.prefix;

function gacha(coeff) {
    if(Math.random() < coeff) return 1;
    else return 0;
}

function getRdmInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

bot.on("ready", async () => {
	bot.user.setActivity("c!help", { type: 'PLAYING' });
	console.log(`${bot.user.username} launched successfully.`.magenta);
	console.log("https://discord.com/api/oauth2/authorize?client_id=873969905710563358&permissions=3197952&scope=bot");
});

bot.on("message", msg => {
	if(msg.author.username != bot.user.username && msg.author.discriminator != bot.user.discriminator && msg.content.slice(0, msg.content.indexOf("!") + 1) == prefix && msg.channel.id != "656239794636062772"){
    	var comm = msg.content.replace(/\s+/g, ' ').trim() + " ";
	    var comm_name = comm.slice(0, comm.indexOf(" "));
		var messArr = comm.split(" ");
//		console.log(comm_name, "0000");
//		for(i = 0; i < messArr.length; i++) console.log(messArr[i]);
	    for(i in comms.comms){
	    	var comm2 = prefix + comms.comms[i].name;
	    	if(comm2 == comm_name){
	    		comms.comms[i].out(bot, msg, messArr);
	    	}
	    }
    } 
});

bot.on("voiceStateUpdate", async (oldState, newState) => {
	if(newState.member.user.username != bot.user.username && newState.member.user.discriminator != bot.user.discriminator && newState.channel != oldState.channel && newState.channel && !newState.member.user.bot){
		
		console.log("<1337> User " + newState.member.user.username + " has connected to the channel " + newState.channel.name + " on server " + newState.member.guild.name + ".");
		
		if(gacha(0.008)) {
			var voiceChannel = newState.member.voice.channel;
			voiceChannel.join().then(connection => {
				var playList = ['./lolkonfa1.secret.mp3', './lolkonfa2.secret.mp3'];
				const dispatcher = connection.play(playList[getRdmInt(0, playList.length)]);
				dispatcher.on('finish', () => voiceChannel.leave());
			}).catch(err => console.log(err));
		}
		else tools.greeting(newState.member);
	}
})

bot.login(token);