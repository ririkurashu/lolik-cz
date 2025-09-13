const Discord = require('discord.js'); 
const djsv = require('@discordjs/voice');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] });
const fs = require('fs');
const { OpusEncoder } = require('@discordjs/opus');
const { Server } = require('http');
const colors = require('colors');
//let config = require('./botconfig.json');
//const aws = require('aws-sdk');
let config = {
	botToken: process.env.REACT_APP_BOT_TOKEN,
	gitToken: process.env.REACT_APP_GIT_TOKEN,
	prefix: "c!"
};
let token = config.botToken;
let gitToken = config.gitToken;
let prefix = config.prefix;
const comms = require("./comms.js");
const tools = require("./tools.js");
const userdb = require('./userdb.json');

const { Octokit } = require ('@octokit/core');
const octokit = new Octokit({
        auth: gitToken
});

function gacha(coeff) {
    if(Math.random() < coeff) return 1;
    else return 0;
}

function getRdmInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

const gitHubUpload = async (path, author) => {
	try {
		let content = fs.readFileSync(path, 'base64');
		/*try { fs.writeFileSync('./1111.mp3', content); }
		catch (e) { console.log(e); };*/
		console.log(`  The file ${path.slice(2)} has been successfully read and is about to be sent to the GitHub repo.`.yellow);
		let params = {
			owner: 'ririkurashu',
			repo: 'lolik-cz',
			path: path.slice(2),
			message: 'Uploaded by ' + author.username + ' via the bot',
			content
		};
		let sha = '';
		try {
			const responseGET = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: 'ririkurashu',
				repo: 'lolik-cz',
				path: path.slice(2)
			});
			console.log("  Status:".yellow, responseGET.status, "\n  The file already exists in the GitHub repository. Trying to replace it...".yellow);
			sha = responseGET.data.sha;
		}
		catch (error) {};
		
		if (sha != '') params.sha = sha;
		const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', params);
		console.log("  Status:".yellow, response.status, "\n  (more info: https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents)");
		return new Promise ((resolve, reject) => resolve()); 
	} 
	catch (err) {
		console.log("  Upload of", `${path.slice(2)}`.cyan, "to GitHub failed, deleting files...\n");
		try {
			fs.unlinkSync(path);
			delete userdb[author.id].playlist[path];
			json = JSON.stringify(userdb, null, "\t");
			fs.writeFile('./userdb.json', json, 'utf8', function(error) {
				if(error) {
					console.log(`  Couldn't remove ${filename} from .json.\n${error}`.red);
					return new Promise ((resolve, reject) => reject(err));
				}
			});
		}
		catch (error) { console.log(`  Couldn't remove files.\n${error}`.red); }
		finally { return new Promise ((resolve, reject) => reject(err)); };
	}
}

module.exports = {
	// ugh
	botmain: async function () {
		bot.on("ready", async () => {
			bot.user.setActivity("c!help", { type: 'PLAYING' });
			console.log(`${bot.user.username} launched successfully.`.magenta);
			console.log("https://discord.com/api/oauth2/authorize?client_id=873969905710563358&permissions=3197952&scope=bot");
		});

		// commands handling
		bot.on("messageCreate", msg => {
			if(msg.author.username != bot.user.username && msg.author.discriminator != bot.user.discriminator && msg.content.slice(0, msg.content.indexOf("!") + 1) == prefix && msg.channel.id != "656239793373446144"){
				var comm = msg.content.replace(/\s+/g, ' ').trim() + " ";
				var comm_name = comm.slice(0, comm.indexOf(" "));
				var messArr = comm.split(" ");
				for(i in comms.comms) {
					var comm2 = prefix + comms.comms[i].name;
					if(comm2 == comm_name){
						comms.comms[i].out(bot, msg, messArr);
					}
				}
			} 
		});
		
		bot.on('interactionCreate', async interaction => {
			if (interaction.isSelectMenu()) {
				let ch = bot.channels.cache.get(interaction.message.channelId);
				let lastMessage;
				await ch.messages.fetch({ limit: 10 }).then(messages => {
					lastMessage = messages.filter(m => m.author.id === interaction.message.author.id).first();
				})
				.catch(console.error);
				//console.log(interaction.message.id, lastMessage.id);
				if (interaction.message.id != lastMessage.id) return;

				//console.log(interaction.message.components);

				const embed = interaction.message.embeds[0];
				/*
				var row = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageSelectMenu()
					.setCustomId(i)
					.setPlaceholder('Nothing selected', i.toString())
					.addOptions([
						{
							label: '10%',
							description: 'This is a description',
							value: "0.1",
						},
						{
							label: '20%',
							description: 'This is also a description',
							value: "0.2",
						},
					])
					.setMinValues(1)
					.setMaxValues(1),
				);
				*/
				
				var row = interaction.message.components;
				var i = interaction.customId.toString();
				
				if (interaction.values[0] > 0) row[i].components[0].placeholder += " – " + (Number(interaction.values[0]) * 100).toString() + "%";
				else row[i].components[0].placeholder += " – No rate";
				row[i].components[0].disabled = true;

				/*const vls = interaction.values[0];
				//await interaction.deferUpdate();
				switch (vls) {
					case "0.1":
						//row[i].components[0].options = [ ];
						row[i].components[0].placeholder += "10%";
						row[i].components[0].disabled = true;
						break;
					case "0.2":
						//row[i].components[0].options = [ ];
						row[i].components[0].placeholder = "20%";
						row[i].components[0].disabled = true;
						break;
				}
				*/
				//console.log(row);
				await interaction.update({ embeds: [embed], components: row });
			}
			else if (interaction.isButton()) {
				delete require.cache [ require.resolve('./userdb.json') ];
				const userdb = require('./userdb.json');

				const jsonUpdate = async pl => {
					try {
						userdb[interaction.user.id].playlist = pl;
						json = JSON.stringify(userdb, null, "\t");
						return new Promise((resolve, reject) => {
							fs.writeFile('./userdb.json', json, 'utf8', function(error) {
								if(error) {
									reject(error);
								}
								else resolve();
							});
						});
					}
					catch (error) { 
						console.log(error);
					}
				}

				var row = interaction.message.components;
				var pl = userdb[interaction.user.id].playlist;
				var plchanged = false;
				var counter = 0;
				//console.log("1", pl);
				for (var i = 0; i < (row.length - 1); i++) {
					var contents = row[i].components[0].placeholder.split(' ');
					if (!row[i].components[0].placeholder.endsWith('.mp3')) { // if select menu is being used
						if (JSON.stringify(pl["./" + contents[0]]) != "{}") { // if the chance in database not empty
							if (contents.length == 3) { // if addition
								if (pl["./" + contents[0]].chance != Number(contents[2].slice(0, contents[2].indexOf("%"))) / 100) { // if doesn't match with the database
									plchanged = true;
									pl["./" + contents[0]].chance = Number(contents[2].slice(0, contents[2].indexOf("%"))) / 100;
								}
							} else	{ // if deletion
								plchanged = true;
								pl["./" + contents[0]] = { };
							}
						}
						else { // if the chance in database empty
							if (contents.length == 3) { // if addition
								plchanged = true;
								pl["./" + contents[0]].chance = Number(contents[2].slice(0, contents[2].indexOf("%"))) / 100;
							}
						}
					}
					if ("chance" in pl["./" + contents[0]]) counter++;
				}
				if (counter == Object.keys(pl).length) {
					const embed = interaction.message.embeds[0];
					embed.setTitle("Oopsie!")
						.setDescription("Sorry, but you can't have all your files with playrates! Please make sure to choose the rates fulfilling this rule.")
						.setFields()
						.setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLVaNy7xwIW0Fz55cBapZXiI5rKAOrFrwLYSovD8Td9_brXffInwBpHUpiYN062QpXMjuhvNYHq8wUx0t_pIlCsvuu9I5nBspgvljyB6TakpZse7e_QT_9p3wky3c9lSKtueFeFx64GAuftmMsjUQk7c=w320-h322-no?authuser=0');
						await interaction.update({ embeds: [embed], components: [] });
					return;
				}
				if(plchanged) 
				// OOOOAOOAOAOAOOAAAAAAOAOOAOOOAAAOAOAAOAAOAAHhH *STARTS TWERKING*
				{
					const embed = interaction.message.embeds[0];
					embed.setTitle("Let's go!!!")
						.setDescription("You have successfully changed the rates!")
						.setFields()
						.setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLWVRJFaAyuPYwYpOnW3-EP8NuCrpkixRIQJ0a2vy7dVSEPobQ05NRCoD-koFX_LAuwu-GPXqzMVv_7-C-jxPNAl-SHMjD75V9m3iQv40tXL48gfBTatgzcmuB_qU5Hcf5e1gSZ_k1DOw6GFsFdbckG6=w320-h319-no?authuser=0');
					await jsonUpdate(pl)
					.then(async () => {
                        console.log("Asynchronous writing of the file".green, "userdb.json".cyan, "is complete.".green);
						await gitHubUpload('./userdb.json', interaction.user)
						.then(async () => {
							console.log("Successfully uploaded the file".green, './userdb.json'.cyan, "to GitHub.".green);
					// might wanna take this up to the moment when an embed is created:
							await interaction.update({ embeds: [embed], components: [] })
							fs.open('./logs.txt', 'a+', (err, fd) => {
								try {
									x = new Date();
									let hoursDiff = x.getHours() + 3;
									x.setHours(hoursDiff);
									logData = `[${x.toUTCString()}]: User ${interaction.user.username} have adjusted their .mp3 rates: ${JSON.stringify(pl)}\n`;
									fs.write(fd, logData, async () => {
										await gitHubUpload('./logs.txt', interaction.user)
										.then(() => {
											console.log("Successfully uploaded the file".green, './logs.txt'.cyan, "to GitHub.".green);
										}).catch(error => {
											console.log(`Failed to upload the file`.red, `./logs.txt`.cyan, `to GitHub.\n${error}`.red);
										});
									})
								} catch (e) {
									console.log("Error during log updating:\n", e)
								} finally {
									fs.close(fd, (err) => {
										if (err) throw err;
									});
								}
							});
						}).catch(error => {
							console.log(`Failed to upload the file`.red, `./userdb.json`.cyan, `to GitHub.\n${error}`.red);
						});
					});
				}
				else {
					const embed = interaction.message.embeds[0];
					embed.setTitle("No way!!!")
					.setDescription("You have not changed anything!")
					.setFields()
					.setThumbnail('https://lh3.googleusercontent.com/pw/AM-JKLWVRJFaAyuPYwYpOnW3-EP8NuCrpkixRIQJ0a2vy7dVSEPobQ05NRCoD-koFX_LAuwu-GPXqzMVv_7-C-jxPNAl-SHMjD75V9m3iQv40tXL48gfBTatgzcmuB_qU5Hcf5e1gSZ_k1DOw6GFsFdbckG6=w320-h319-no?authuser=0');
					await interaction.update({ embeds: [embed], components: [] })
				}
			}
		});

		// this buddy's main job
		bot.on("voiceStateUpdate", async (oldState, newState) => {
			if(newState.member.user.username != bot.user.username && newState.member.user.discriminator != bot.user.discriminator && newState.channel != oldState.channel && newState.channel && !newState.member.user.bot){
				x = new Date();
				let hoursDiff = x.getHours()/* + 3*/;
				x.setHours(hoursDiff);
				console.log(`[${x.toLocaleString()}]: User ` + newState.member.user.username + " has connected to the channel " + newState.channel.name + " on server " + newState.member.guild.name + ".");
				
				if((newState.guild.id == "656239793373446144") && (gacha(0.001))) {
					tools.greetingRare(newState.member);
				}
				else {
					tools.greeting(newState.member);
				}
			}
		})

		bot.on('warning', e => console.warn(e.stack));

		bot.login(token);
	}
}
