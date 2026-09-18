const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// 🔒 ORIGINAL AUTHOR LOCK
const ORIGINAL_AUTHOR = "𝕸𝖎𝖑𝖔𝖓";

module.exports.config = {
  name: "arrest",
  version: "1.0.12",
  hasPermssion: 0,
  credits: "𝕸𝖎𝖑𝖔𝖓", // 🎯 আপনার স্টাইলিশ নাম
  description: "Arrest a criminal in the police station!",
  commandCategory: "fun",
  usages: "[@mention or reply]",
  cooldowns: 5
};

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: ─꯭─⃝͎̽𓆩মিঁলঁনেঁরঁ ফেঁমাঁসঁ বঁটঁ‣᭄𓆪___//😽🩵🪽
 * 👤 OWNER: 𝕸𝖎𝖑𝖔𝖓
 * 🛠️ PROJECT: MILON BOT PROJECT (2026)
 * --------------------------------------- */

module.exports.run = async function ({ api, event, args }) {
  
  // 🔒 ANTI-EDIT CHECK
  if (this.config.credits !== ORIGINAL_AUTHOR) {
      return api.sendMessage(`❌ This file has been modified illegally. Author mismatch detected!\n\n👑 Original Creator: ${ORIGINAL_AUTHOR}`, event.threadID, event.messageID);
  }

  // 🔒 PERMISSION CHECK 
  if (this.config.hasPermssion > 0) {
      const isAdmin = global.config.ADMINBOT.includes(event.senderID);
      if (!isAdmin) {
           return api.sendMessage("⚠️ আগে মিলন বসের থেকে অনুমতি নিয়ে এডমিন লেভেলে আয়, তারপর ট্রাই কর! 👑", event.threadID, event.messageID);
      }
  }

  const { threadID, messageID, senderID, mentions, messageReply } = event;

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

  let targetID = senderID;
  let targetName = "User";

  // মিরাই বটের মেনশন ও রিপ্লাই ধরার সিস্টেম
  if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    targetName = mentions[targetID].replace("@", ""); 
  } else if (messageReply) {
    targetID = messageReply.senderID;
    try {
      const userInfo = await api.getUserInfo(targetID);
      targetName = userInfo[targetID]?.name || "User";
    } catch (err) {
      targetName = "User";
    }
  } else {
    // কাউকে মেনশন বা রিপ্লাই না করলে নিজের প্রোফাইল পিকচার নেবে
    try {
      const userInfo = await api.getUserInfo(targetID);
      targetName = userInfo[targetID]?.name || "User";
    } catch (err) {
      targetName = "User";
    }
  }

  const filePath = path.join(cacheDir, `arrest_milon_${Date.now()}.png`);

  try {
    // ⚠️ ডাবল মেসেজ বন্ধ করার জন্য ওয়েটিং মেসেজটি রিমুভ করা হয়েছে

    // 🖼️ ইমগুর লিংক (থানায় গ্রেফতারের ছবি)
    const imgLink = "https://i.imgur.com/2O67qUU.jpeg"; 
    const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
    const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

    const [baseImage, targetPfp] = await Promise.all([
      loadImage(imgLink),
      loadImage(targetPfpUrl)
    ]);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // ব্যাকগ্রাউন্ড ড্র করা
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // ==========================================
    // 📐 বেস্ট পারফেক্ট ক্যালকুলেশন 
    // ==========================================
    const pfpWidth = 115;  
    const pfpHeight = 115; 
    
    const x = 455; 
    const y = 80;  

    ctx.save();
    
    // প্রোফাইল পিক গোল করে কাটা
    ctx.beginPath();
    ctx.arc(
      x + pfpWidth / 2,
      y + pfpHeight / 2,
      pfpWidth / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(targetPfp, x, y, pfpWidth, pfpHeight);

    ctx.restore();

    // ন্যাচারাল লুক ও ফিনিশিংয়ের জন্য কালো বর্ডার
    ctx.beginPath();
    ctx.arc(
      x + pfpWidth / 2,
      y + pfpHeight / 2,
      pfpWidth / 2,
      0,
      Math.PI * 2
    );
    ctx.lineWidth = 4; 
    ctx.strokeStyle = "#000";
    ctx.stroke();

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    const finalCaption = `🚨 মাইনকা চিপায় ধরা খাইলো আসামি! 🚨\n\nনাম: ${targetName} 🤣\nডিএমপি পুলিশ হাতেনাতে ধরে থানায় নিয়ে এসেছে! কেউ আর সুপারিশ করতে আইসেন না! 🚓⛓️`;

    return api.sendMessage({
      body: finalCaption,
      mentions: [{ tag: targetName, id: targetID }],
      attachment: fs.createReadStream(filePath)
    }, threadID, () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, messageID);

  } catch (e) {
    console.error("ARREST ERROR:", e);
    // ⚠️ API Error Message
    return api.sendMessage("❌ API error call boss milon", threadID, messageID);
  }
};
```eof

ফাইলটা সেভ করে রান করুন। ডাবল মেসেজ ছাড়াই এখন একদম ঠিকঠাক কাজ করবে!
