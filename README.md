# Cum Zone bot - the one and only!
A small Discord bot that plays a short audio file when anyone joins a voice channel, basically a greeting bot. It was September 2020, I just felt like adding one to my server, but couldn't find any, so here we are. The repo is kinda messy because of all these `.mp3`'s. I feel no shame about it. The real shame is in the code. Little you know, the actual cum zone it right there.

Current release:

# Cum Zone v2.1 - I had to do it to em
This release was a necessary measure since there's a security issue between Heroku and GitHub, which made direct deploys from GitHub to Heroku impossible. 
Now the app downloads its current version from this repo on start. The Heroku dyno restarts itself daily, deleting all the changes to the local filesystem, so this really had to be done. Even though the Heroku/GitHub incident is over already and the connection between these two services works again, I'm keeping the code as it is, because the bot used to redeploy its app and reboot after every single change made in its files by users, which sure sucked. I don't know for how long will this sussy code be working, but it seems to be doing fine for around 2 weeks now. It better be.

What else is new:
- the randomization is back, and it comes with a new command. Users can type `c!rates` to adjust the chances of their files to be played, through some fancy embeds and really nasty code;
- the `userdb.json` is now organized in a slightly different way to support the randomization;
- the `c!tlmy` command now hides users' secret files (the ones with names ending with `.secret.mp3`) if used in a server text channel. It just mentions the number of such files the user has, if there are any;
- there's now `logs.txt` file for logging every single time users mess with my precious boy's files;
- a bunch of errors of various calibers have been fixed. I seriously don't know how have the bot managed to work almost flawlessly for 9 months with all that shit going on;
- the overall code is now updated to support discord.js v13! Let's go!!! (I really hated doing this! Node-gyp sucks ass!)

Still got to do (probably not gonna happen):
1. Сlean up the file system from all those `.mp3`'s. Sweep them under the rug or I don't know.
2. Memory losses. They do be happening from time to time, and I don't really know how to deal with them. Listen, I ain't no programmer, I just like to vibe for around 50 hours once a year, writing the most kludgy code imaginable from the tiny pieces I find on the internet. Therefore, I lack critical information to even comprehend the concept of memory loss.
3. The bot's already been added to another server besides its original habitat, and I still haven't reorganized the userdb in a way to hide the files of the other servers' users in tracklists. It's harder to come up with a solution to this than it seems, because a user can be present on multiple servers with this bot and all that. Maybe it's not needed at all, because it's kinda not fair if a file you upload gets rejected because there already is one with that name, but you haven't been able to see it.
4. If the bot somehow gets added to a big number of servers and starts being used a lot (which is not happening for sure), it'll get me cornered, because I'll need to give up on Heroku and/or find a convenient cloud storage for all the userfiles, which has to be free because I'm totally not gonna pay for this. And I don't know such a service now, and also am too lazy to bother.
5. Smooth and user-friendly files management, yeah. Definitely not through embeds though, I've researched on this topic, and can conclude that embeds are not omnipotent. They actually suck, if I must say. Now a simple webpage sounds quite suited for this task, and it's even doable via Heroku if I remember correctly. But this implies authentification, and I don't know if it will be able to deal with DDoS or anything like that. Anyway, this one is the most likely to be done next, but it will make all the effort I've put into creating those bot commands worthless... and will make me write so much... I don't know.

## My contacts

If you want to discuss the greatness of my sweet child, or just feel kinda lonely on a friday night, text me on [Discord](https://discordapp.com/users/643129279298928641/) or [Telegram](https://t.me/lllliye).
