module.exports.config = {
 name: "info",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SHAHADAT SAHU",
 description: "Bot information command",
 commandCategory: "For users",
 hide: true,
 usages: "",
 cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
 const { threadID } = event;
 const request = global.nodemodule["request"];
 const fs = global.nodemodule["fs-extra"];
 const moment = require("moment-timezone");

 const { configPath } = global.client;
 delete require.cache[require.resolve(configPath)];
 const config = require(configPath);

 const { commands } = global.client;
 const threadSetting = (await Threads.getData(String(threadID))).data || {};
 const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : config.PREFIX;

 const uptime = process.uptime();
 const hours = Math.floor(uptime / 3600);
 const minutes = Math.floor((uptime % 3600) / 60);
 const seconds = Math.floor(uptime % 60);

 const totalUsers = global.data.allUserID.length;
 const totalThreads = global.data.allThreadID.length;

 const msg = `╭⭓ ⪩ 𝐁𝐎𝐓𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ⪨
│
├─ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
├─ ☢️ 𝗣𝗿𝗲𝗳𝗶𝘅 : ${config.PREFIX}
├─ ♻️ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗕𝗼𝘅 : ${prefix}
├─ 🔶 𝗠𝗼𝗱𝘂𝗹𝗲𝘀 : ${commands.size}
├─ 🔰 𝗣𝗶𝗻𝗴 : ${Date.now() - event.timestamp}ms
│
╰───────⭓

╭⭓ ⪩ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ⪨
│
├─ 👑 𝗡𝗮𝗺𝗲 : 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓 𝐒𝐀𝐇𝐔
├─ 📲 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :
│ facebook.com/100044713412032
├─ 💌 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 :
│ m.me/100044713412032
├─ 📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :
│ wa.me/+8801882333052
│
╰───────⭓

╭⭓ ⪩ 𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗜𝗘𝗦 ⪨
│
├─ ⏳ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 : ${hours}h ${minutes}m ${seconds}s
├─ 📣 𝗚𝗿𝗼𝘂𝗽𝘀 : ${totalThreads}
├─ 🧿 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀 : ${totalUsers}
╰───────⭓

❤️ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 🌺
 😍─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭😘`;

 const imgLinks = [
    "https://i.imgur.com/gokzyKd.jpeg",
    "https://i.imgur.com/g3hlQ0Z.jpeg",
    "https://i.imgur.com/L7txp4M.jpeg",
    "https://i.imgur.com/5dG8PS5.jpeg"
 ];

 const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];

 const callback = () => {
 api.sendMessage({
 body: msg,
 attachment: fs.createReadStream(__dirname + "/cache/info.jpg")
 }, threadID, () => fs.unlinkSync(__dirname + "/cache/info.jpg"));
 };

 return request(encodeURI(imgLink)).pipe(fs.createWriteStream(__dirname + "/cache/info.jpg")).on("close", callback);
};
