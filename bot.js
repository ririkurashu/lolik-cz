const Discord = require('discord.js'); 
const bot = new Discord.Client();
const comms = require("./comms.js"); // Подключаем файл с командами для бота
const fs = require('fs'); // Подключаем родной модуль файловой системы node.js  
const ytdl = require('ytdl-core');
let config = require('./botconfig.json'); //подключаем файл конфигурации
let prefix = config.prefix; //"достаём" префикс

//создаём ссылку-приглашение для бота
/*
bot.on('ready', () => { 
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => { 
        console.log(link);
    });
});
*/

bot.on("ready", function(){ /* Бот при запуске должен отправить в терминал сообщение «[Имя бота] запустился!» */
	console.log(bot.user.username + " запустился!");
	console.log("https://discord.com/api/oauth2/authorize?client_id=749320971890196600&permissions=3148800&scope=bot");
});


bot.on("message", msg => { // Реагирование на сообщения
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
	if(newState.member.user.username != bot.user.username && newState.member.user.discriminator != bot.user.discriminator && newState.channel != oldState.channel && newState.channel)
	{
		console.log("1337");
		var voiceChannel = newState.member.voice.channel;
		voiceChannel.join().then(connection =>{
			const stream = ytdl('https://youtu.be/ODdTcug_3tA', { filter: 'audioonly' });
			const dispatcher = connection.play(stream);
			dispatcher.on('finish', () => voiceChannel.leave());
		}).catch(err => console.log(err));
	}
})

bot.login(process.env.BOT_TOKEN);
