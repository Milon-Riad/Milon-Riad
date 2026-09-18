const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// 🔒 ORIGINAL AUTHOR LOCK
const ORIGINAL_AUTHOR = "𝕸𝖎𝖑𝖔𝖓";

module.exports.config = {
  name: "rip",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝕸𝖎𝖑𝖔𝖓",
  description: "Generate a RIP banner image using target Facebook UID via Canvas",
  commandCategory: "banner",
  usePrefix: true,
  usages: "[@mention | reply]",
  cooldowns: 0,
  dependencies: {
    "canvas": "",
    "fs-extra": "",
    "path": ""
  }
};

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: ─꯭─⃝͎̽𓆩মিঁলঁনেঁরঁ ফেঁমাঁসঁ বঁটঁ‣᭄𓆪___//😽🩵🪽
 * 👤 OWNER: 𝕸𝖎𝖑𝖔𝖓
 * 🛠️ PROJECT: MILON BOT PROJECT (2026)
 * --------------------------------------- */

module.exports.run = async function ({ event, api }) {
  
  // 🔒 ANTI-EDIT CHECK
  if (this.config.credits !== ORIGINAL_AUTHOR) {
      return api.sendMessage(`❌ This file has been modified illegally. Author mismatch detected!\n\n👑 Original Creator: ${ORIGINAL_AUTHOR}`, event.threadID, event.messageID);
  }

  const { threadID, messageID, mentions, messageReply } = event;
  
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

  let targetID = null;

  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else if (messageReply && messageReply.senderID) {
    targetID = messageReply.senderID;
  }

  if (!targetID) {
    return api.sendMessage(
      "Please reply or mention someone......",
      threadID,
      messageID
    );
  }

  const imgPath = path.join(cacheDir, `rip_${targetID}_${Date.now()}.png`);

  try {
    // 🖼️ কবরের ব্যাকগ্রাউন্ড ছবি (চেঞ্জ করতে চাইলে লিংক পালটে নিও)
    const imgLink = "https://i.imgur.com/cE0Gj5b.png"; 
    const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
    const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

    const [baseImage, targetPfp] = await Promise.all([
      loadImage(imgLink),
      loadImage(targetPfpUrl)
    ]);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // 📐 ছবির সাইজ ও পজিশন (কবরের ফ্রেম অনুযায়ী)
    const pfpSize = 180; 
    const x = (canvas.width - pfpSize) / 2; // মাঝখানে বসানোর জন্য
    const y = 200; // ওপর থেকে নিচে নামানোর জন্য

    ctx.save();
    
    // গোল করে কাটার জন্য
    ctx.beginPath();
    ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(targetPfp, x, y, pfpSize, pfpSize);
    ctx.restore();

    // কালো বর্ডার
    ctx.beginPath();
    ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imgPath, buffer);

    return api.sendMessage(
      {
        body: "", 
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      },
      messageID
    );

  } catch (e) {
    console.error("RIP ERROR:", e);
    return api.sendMessage(
      "❌ API error call boss milon",
      threadID,
      messageID
    );
  }
};
```eof
