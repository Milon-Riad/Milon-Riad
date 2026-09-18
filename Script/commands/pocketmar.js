const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// 🔒 ORIGINAL AUTHOR LOCK
const ORIGINAL_AUTHOR = "𝕸𝖎𝖑𝖔𝖓";

module.exports.config = {
  name: "pocketmar",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝕸𝖎𝖑𝖔𝖓", // 🎯 আপনার স্টাইলিশ নাম
  description: "Create a funny pocketmar (pickpocket) image.",
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

  // 🔒 PERMISSION CHECK (যদি প্রাইভেট করতে চান)
  if (this.config.hasPermssion > 0) {
      const isAdmin = global.config.ADMINBOT.includes(event.senderID);
      if (!isAdmin) {
           return api.sendMessage("⚠️ আগে মিলন বসের থেকে অনুমতি নিয়ে এডমিন লেভেলে আয়, তারপর ট্রাই কর! 👑", event.threadID, event.messageID);
      }
  }

  const { threadID, messageID, senderID, mentions, messageReply } = event;

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

  let targetID;
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
    return api.sendMessage("আরে মামা, কোন পকেটমারকে ধরবি তারে তো মেনশন বা রিপ্লাই দিলি না! 👛🏃‍♂️", threadID, messageID);
  }

  const filePath = path.join(cacheDir, `pocketmar_milon_${Date.now()}.png`);

  try {
    // ⚠️ ডাবল মেসেজ বন্ধ করার জন্য ওয়েটিং মেসেজটি রিমুভ করা হয়েছে

    // 🖼️ আপনার দেওয়া ফাইনাল ইমেজ লিংক
    const imgLink = "https://i.imgur.com/1J4w5Gn.jpeg"; 
    const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
    const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

    const [baseImage, targetPfp] = await Promise.all([
      loadImage(imgLink),
      loadImage(targetPfpUrl)
    ]);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // 📐 একদম পারফেক্ট ফাইনাল ক্যালকুলেশন
    const pfpWidth = 130; 
    const pfpHeight = 130; 
    
    const x = 385; 
    const y = 115; 

    ctx.save();
    
    // ছবি গোল করে কাটার জন্য
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

    // ন্যাচারাল লুকের জন্য কালো বর্ডার
    ctx.beginPath();
    ctx.arc(
      x + pfpWidth / 2,
      y + pfpHeight / 2,
      pfpWidth / 2,
      0,
      Math.PI * 2
    );
    ctx.lineWidth = 5; 
    ctx.strokeStyle = "#000";
    ctx.stroke();

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    const finalCaption = `🚨 বাসে পকেট মারতে গিয়ে ধরা খেলো পকেটমার! 🚨\n\nনাম: ${targetName} 🤣\nজনতা ধইরা আচ্ছা মতো সাইজ করছে! \nসবাই নিজেদের মানিব্যাগ চেক করেন মামা! 👛👊`;

    return api.sendMessage({
      body: finalCaption,
      mentions: [{ tag: targetName, id: targetID }],
      attachment: fs.createReadStream(filePath)
    }, threadID, () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, messageID);

  } catch (e) {
    console.error("POCKETMAR ERROR:", e);
    // ⚠️ API Error Message
    return api.sendMessage("❌ API error call boss milon", threadID, messageID);
  }
};
```eof

ফাইলটা সেভ করে রান করুন বস। এটা এখন মিরাই বটে একদম স্মুথলি কাজ করবে!
