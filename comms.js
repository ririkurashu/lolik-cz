const config = require('./botconfig.json');
const tools = require("./tools.js");
const fs = require('fs');
const Discord = require('discord.js'); 
const prefix = config.prefix;

async function stop (bot, mess, args) 
{
        if(mess.author.id != "643129279298928641") return mess.channel.send("сосеш")
        else{
                await mess.channel.send("Бот выключается.");
                process.exit();
        }
}

function play (bot, mess, args) {
        if(mess.member.voice.channel)
        {
                if(mess.member.voice.channel.permissionsFor(mess.member.client.user).has("CONNECT") && mess.member.voice.channel.permissionsFor(mess.member.client.user).has("SPEAK")){
                        var voiceChannel = mess.member.voice.channel;
                        if(args[1])
                        {
                                var files = fs.readdirSync("./");
                                for(i = 0; i < files.length; i++){
                                        if(files[i].indexOf(".mp3") == -1 || files[i].indexOf(".mp3.sfk") > -1) {
                                                files.splice(i, 1);
                                                i--;
                                        }
                                        else files[i] = files[i].slice(0, files[i].lastIndexOf(".mp3"));
                                }
                                if(files.indexOf(args[1].toLowerCase()) > -1){
                                        voiceChannel.join().then(connection => {
                                                const dispatcher = connection.play(`./${args[1].toLowerCase()}.mp3`);
                                                dispatcher.on('finish', () => voiceChannel.leave());
                                        }).catch(err => console.log(err));
                                }
                                else mess.channel.send("Не могу найти файл с таким названием.\nВызовите `cz!tracklist` и сверьтесь со списком.");
                        }
                        else{
                                voiceChannel.join().then(connection => {
                                        const dispatcher = connection.play('./cumzone.mp3');
                                        dispatcher.on('finish', () => voiceChannel.leave());
                                }).catch(err => console.log(err));
                        }
                }
        }
        else mess.channel.send("Чтобы эта команда работала, вы должны находиться в войсчате.");
}

function playme (bot, mess, args) {
        if(mess.member.voice.channel)
        {
                tools.greeting(mess.member);
        }
        else mess.channel.send("Чтобы эта команда работала, вы должны находиться в войсчате.");
}

function help (bot, mess, args) {
        mess.channel.send("Аpмия. Постpоение. Hовобpанцы. Пpапоpщик:\n- Иванов!\n- Я!\n- Кем был до аpмии?\n- Каменщиком.\n- Hоpмально. Будешь класть казаpмы.\n- Петpов!\n- Я!\n- Кем был до аpмии?\n- Маляpом.\n- Hоpмально. Будешь кpасить казаpмы.\n- Попов!\n- Я!\n- Кем был до аpмии?\n- Плотником.\n- Hоpмально. Будешь делать pамы для казаpм.\n- Сидоpов!\n- Я!\n- Кем был до аpмии?\n- Клюкальщиком.\n- Кем кем?\n- Клюкальщиком!\n- А что же ты, Сидоpов, делал?\n- Клюкалы, товаpищ пpапоpщик!\n- Hи хуя себе! А что же это за вещь, это самое клюкало?\n- А вот дайте мне лист железа, молоток и мастеpскую, так я вам в тpи дня такое клюкало заебеню.\n- Hу ладно, давай.\nДают Сидоpову все, что он попpосил, и он удаляется в мастеpскую. Тpи дня из мастеpской доносится шум, летят искpы, валит дым. И вот чеpез тpи дня выходит из мастеpской Сидоpов, весь гpязный, закопченый, вспотевший, но гоpдый. И несет он пеpед собой лист железа, вес помятый, в дыpах, сто pаз свеpнут и пеpегнут. Охуевший пpапоp спpашивает:\n- Сидоpов. Что это это у тебя за хуйня?\n- Клюкало.\n- Да ты че, Сидоpов, блядь, охуел что ли? Вздумал нас наебывать? Hа ГУБУУУ!\nУводят Сидоpова на губу, клюкало бpосают в угол. Пpоходит неделя. В часть с пpовеpкой пpиезжает генеpал. Идет, все осматpивает, все ему нpавится, и как казаpмы покpашены, и чистота везде. Заходит к пpапоpу, и вдpуг видит в углу клюкало.\n- Hи хуя себе, вот это да, вот это клюкало! Кто сделал?\nОхуевший пpапоp:\n- Сидоpов.\n- Где Сидоpов?\n- Hа губе.\n- Да вы что тут, охуели все в конец, быстpо его сюда!\nПpиводят Сидоpова.\n- Сидоpов. Ты сделал такое заебенное клюкало?\n- Я.\n- И сколько ж ты, скажи мне, делал его?\n- pи дня.\n- Hи хуя ж себе! У меня на такое клюкало не меньше месяца уходит! Пойдем запустим!?\n- Конечно, товаpищ генеpал, о чем pечь!\nИдут генеpал с Сидоpовым на озеpо. Садятся в лодку и заплывают на самую сеpедину.\n- Вась (так звали Сидоpова), можно я клюкало запущу?\n- Давайте.\n");
        mess.channel.send("Генеpал беpет остоpожно клюкало в pуки, поднимает над головой и кидает в озеpо. Клюкало с хаpактеpным звуком КЛЮЮК уходит в озеpо.\nГенеpал восхищенно, взволнованным голосом:\n-  я понимаю что анек крутой, но зачем столько лайков то?))\nПолковник бустеренко:\n- нюхай бебру ес минус три юхуу кит ты маму мав\nэвелон: ооо повизло повизло\nupd лучше бы так аву лайкали");
}

function tracklist (bot, mess, args) {
        mess.channel.send("Сегодня только `cz!playme`! :clown:");
}

var comms_list = [
        {name: "stop", out: stop, about: "Stops the bot"},
        {name: "play", out: play, about: "Plays CumZone"},
        {name: "playme", out: playme, about: "Plays a personal greeting"},
        {name: "help", out: help, about: "Sends the help message"},
        {name: "tracklist", out: tracklist, about: "Sends the tracklist"}
]

module.exports.comms = comms_list;