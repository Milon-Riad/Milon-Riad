const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "owner",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "MD MILON SARKAR",
  description: "Show Owner Info with styled box & random photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  
  // সময় বের করার জন্য ভেরিয়েবল
  const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  const info = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│      👑 𝕸𝕯 𝕸𝖎𝖑𝖔𝖓 𝕾𝖆𝖗𝖐𝖆𝖗 👑
│       『 𝑶𝑾𝑵𝑬𝑹 𝑷𝑹𝑶𝑭𝑰𝑳𝑬 』
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
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

  const images = [
    "https://i.imgur.com/O9mM8gZ.jpeg",
    "https://i.imgur.com/TPozj9H.jpeg",
    "https://i.imgur.com/KQZPVNi.jpeg",
    "https://i.imgur.com/WeuOglF.jpeg"
  ];

  const randomImg = images[Math.floor(Math.random() * images.length)];

  const callback = () => api.sendMessage(
    {
      body: info,
      attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
    },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/owner.jpg")
  );

  return request(encodeURI(randomImg))
    .pipe(fs.createWriteStream(__dirname + "/cache/owner.jpg"))
    .on("close", () => callback());
};
