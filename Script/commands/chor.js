const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// 🔒 ORIGINAL AUTHOR LOCK
const ORIGINAL_AUTHOR = "𝕸𝖎𝖑𝖔𝖓";

module.exports.config = {
  name: "chor",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝕸𝖎𝖑𝖔𝖓",
  description: "Generate scooby-doo meme using sender and target Facebook UID via Canvas",
  commandCategory: "fun",
  usePrefix: true,
  usages: "[@mention | reply]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "canvas": ""
  }
};

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: ─꯭─⃝͎̽𓆩মিঁলঁনেঁরঁ ফেঁমাঁসঁ বঁটঁ‣᭄𓆪___//😽🩵🪽
 * 👤 OWNER: 𝕸𝖎𝖑𝖔𝖓
 * 🛠️ PROJECT: MILON BOT PROJECT (2026)
 * --------------------------------------- */

module.exports.run = async function ({ event, api, args }) {
  
  // 🔒 ANTI-EDIT CHECK
  if (this.config.credits !== ORIGINAL_AUTHOR) {
      return api.sendMessage(`❌ This file has been modified illegally. Author mismatch detected!\n\n👑 Original Creator: ${ORIGINAL_AUTHOR}`, event.threadID, event.messageID);
  }

  const { threadID, messageID, mentions, messageReply } = event;
  
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

  let targetID = null;
  let targetName = "User";

  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    targetName = mentions[targetID].replace("@", "");
  } else if (messageReply && messageReply.senderID) {
    targetID = messageReply.senderID;
    try {
      const userInfo = await api.getUserInfo(targetID);
      targetName = userInfo[targetID]?.name || "User";
    } catch (err) {
      targetName = "User";
    }
  }

  if (!targetID) {
    return api.sendMessage(
      "Please reply or mention someone......",
      threadID,
      messageID
    );
  }

  const imgPath = path.join(cacheDir, `chor_${targetID}_${Date.now()}.png`);

  try {
    // নষ্ট API বাদ দিয়ে নতুন লোকাল ক্যানভাস জেনারেশন এবং ফেসবুক API টোকেন
    const imgLink = "https://i.imgur.com/ES28alv.png"; 
    const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
    const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

    const [baseImage, targetPfp] = await Promise.all([
      loadImage(imgLink),
      loadImage(targetPfpUrl)
    ]);

    const canvas = createCanvas(500, 670); 
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // আগের চোর কমান্ডের পারফেক্ট মেজারমেন্ট
    const pfpWidth = 111;
    const pfpHeight = 111;
    const x = 48;
    const y = 410;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x + pfpWidth / 2, y + pfpHeight / 2, pfpWidth / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(targetPfp, x, y, pfpWidth, pfpHeight);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(x + pfpWidth / 2, y + pfpHeight / 2, pfpWidth / 2, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imgPath, buffer);

    const caption = `হালা মুরগী চোর তোরে আজকে হাতে নাতে ধরছি পালাবি কই 😹🕵️‍♂️\n=> ${targetName}`;

    return api.sendMessage(
      {
        body: caption,
        mentions: [{ tag: targetName, id: targetID }],
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      },
      messageID
    );

  } catch (e) {
    console.error("CHOR ERROR:", e);
    return api.sendMessage(
      "❌ API error call boss milon",
      threadID,
      messageID
    );
  }
};
```eof
