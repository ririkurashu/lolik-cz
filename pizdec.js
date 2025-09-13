//const config = require('./botconfig.json'); 
//const aws = require('aws-sdk');
let config = {
	botToken: process.env.REACT_APP_BOT_TOKEN, // i genuinely hate heroku at this point
	gitToken: process.env.REACT_APP_GIT_TOKEN,
	prefix: "c!"
};
const fs = require('fs');
const { Octokit } = require ('@octokit/core');

const Axios = require('axios');
//const extract = require('extract-zip')
//const mv = require('mv');
const StreamZip = require('node-stream-zip');

//const { move } = require('fs-extra');

const octokit = new Octokit({
        auth: config.gitToken
});

//const { promises: { readdir } } = require('fs')

/*
const getDirs = async (source) => {
        let dirs = fs.readdirSync(source, { withFileTypes: true });
        //console.log("1.", dirs);
        //let contents = [];
        for (i = 0; i < dirs.length; i++) {
                if ((dirs[i].name.endsWith(".mp3") || dirs[i].name.endsWith(".js") || dirs[i].name.endsWith(".json"))) {
                        //contents.push(dirs[i].name);
                        try { 
                                fs.unlinkSync(dirs[i].name); 
                                //console.log(dirs[i].name) 
                        }
                        catch (e) { console.log("DELETEFILES ERROR: ", e) }
                }
        }
        //console.log("CONTENTS:", contents);
        return dirs.filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

const ext = async (zip) => {
        try {
                await extract(zip, { dir: __dirname });
                console.log('Extraction complete');
                fs.unlink("repo.zip", (err) => { 
                        if (err) console.log(err);
                });
        } catch (err) { console.error("Failed to extract file", err) }
}
*/

async function githubManualDeploy () {
        console.log("Trying to manually deploy from GitHub...");
        //console.log(config.gitToken, typeof config.gitToken);
        const file = fs.createWriteStream("repo.zip");
        const result = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', {
                owner: 'ririkurashu',
                repo: 'lolik-cz',
                ref: 'master'
        });
        const response = await Axios({
                url: result.url,
                method: 'GET',
                responseType: 'stream'
        });
        response.data.pipe(file);
        file.on('close', async () => {
                var errf = false;
                try {
                        console.log("Zip successfully downloaded.")
                        file.close((err) => {
                                if (err) console.error("Failed to close file", err);
                        });

                        let d = fs.readdirSync(__dirname);
                        for (i = 0; i < d.length; i++) {
                                if (d[i].endsWith(".mp3")) {
                                        //contents.push(d[i]);
                                        try { 
                                                fs.unlinkSync(d[i]); 
                                                //console.log(d[i]) 
                                        }
                                        catch (e) { console.log("DELETEFILES ERROR: ", e) }
                                }
                        }

                        const zip = new StreamZip.async({ file: './repo.zip' });
                        const entries = await zip.entries();
                        var en;
                        for (const entry of Object.values(entries)) {
                        if (entry.isDirectory) {
                                en = entry.name;
                                break;
                                }
                        }
                        //console.log(en);
                        await zip.extract(en, __dirname);
                        await zip.close();
                        fs.unlink("repo.zip", (err) => { 
                                if (err) console.log(err);
                        });
                        console.log("Unzipped successfully.");
                }
                catch (e) { 
                        console.log("Zip processing error:", e);
                        errf = true;
                        try {
                                fs.unlinkSync("repo.zip");
                        }
                        catch (err) { console.log(err) }
                }
                finally {
                        if (!errf) {
                                const bot = require('./bot.js'); 
                                bot.botmain();
                        }
                        else console.log("The bot couldn't start because there was an error shown abowe!");
                }

                /*
                await ext ("./repo.zip").then(async () => {
                        await getDirs(__dirname).then(async (folders) => {
                                //console.log("2.", folders);
                                var path = "";
                                for (i = 0; i < folders.length; i++) {
                                        if (folders[i].indexOf("ririkurashu-lolik-cz") > -1) {
                                                path = __dirname + "/" + folders[i];
                                                break;
                                        } 
                                }
                                let d = fs.readdirSync(path);
                                for (i = 0; i < d.length; i++) {
                                        //if (!d[i].name.endsWith(".mp3") && d[i].name != "userdb.json") {
                                                //contents.push(dirs[i].name);
                                                try { 
                                                        fs.unlinkSync(d[i].name); 
                                                        //console.log(dirs[i].name) 
                                                }
                                                catch (e) { console.log("DELETEFILES ERROR: ", e) }
                                        //}
                                }
                                try {                                                
                                        mv(path, __dirname, { mkdirp: false, clobber: true }, (err) => {
                                                if (err) {
                                                        console.log("Mv error:", err);
                                                }
                                                else {
                                                        const bot = require('./bot.js'); 
                                                        console.log("Mv success");
                                                        bot.botmain();
                                                }
                                        });
                                } catch (e) {
                                        console.log(e);
                                }
                        });
                });
                */
        });
        file.on('error', async () => {
                fs.unlink("repo.zip", (e => {
                        if (e) console.error("Failed to write .zip file frim GitHub:", e);
                }));
                console.error("Failed to write .zipffile frim GitHub:", err);
        });
}

githubManualDeploy();

//const bot = require('./bot.js'); 
//bot.botmain();