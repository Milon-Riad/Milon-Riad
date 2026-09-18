const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "ULLASH", //don't change my credit 
    description: "Show Owner Info",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    var callback = () => api.sendMessage({
        body: `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│      👑 𝕸𝕯 𝕸𝖎𝖑𝖔𝖓 𝕾𝖆𝖗𝖐𝖆𝖗 👑
│       『 𝑨𝑫𝑴𝑰𝑵 𝑷𝑹𝑶𝑭𝑰𝑳𝑬 』
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤
│ 👤 𝙉𝙖𝙢𝙚      ⟿ 𝕸𝕯 𝕸𝖎𝖑𝖔𝖓 𝕾𝖆𝖗𝖐𝖆𝖗
│ 🚹 𝙂𝙚𝙣𝙙𝙚𝙧    ⟿ 𝑴𝒂𝒍𝒆
│ ❤️ 𝙎𝙩𝙖𝙩𝙪𝙨    ⟿ 𝑷𝒖𝒓𝒆 𝑺𝒊𝒏𝒈𝒍𝒆 🥲
│ 🎂 𝘼𝙜𝙚       ⟿ 23+
│ ☪️ 𝙍𝙚𝙡𝙞𝙜𝙞𝙤𝙣  ⟿ 𝑰𝒔𝒍𝒂𝒎
│ 🎓 𝙀𝙙𝙪𝙘𝙖𝙩𝙞𝙤𝙣 ⟿ 𝑫𝒂𝒌𝒉𝒊𝒍 (SSC 2020)
│ 📍 𝘼𝙙𝙙𝙧𝙚𝙨𝙨  ⟿ 𝑲𝒖𝒓𝒊𝒈𝒓𝒂𝒎, 𝑩𝒂𝒏𝒈𝒍𝒂𝒅𝒆𝒔𝒉
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤
│ 💬 𝙈𝙚𝙨𝙨𝙚𝙣𝙜𝙚𝙧
│ ⟿ m.me/100081225144815
│
│ 🌐 𝙁𝙖𝙘𝙚𝙗𝙤𝙤𝙠
│ ⟿ https://www.facebook.com/share/1L5yE6MrT6/
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤
│ 🕒 𝑼𝒑𝒅𝒂𝒕𝒆𝒅 : ${time}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    const imageURL = "https://i.imgur.com/4IkBrWK.jpeg";

    return request(encodeURI(imageURL))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
