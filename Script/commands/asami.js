const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

// 🔒 ORIGINAL AUTHOR LOCK
const ORIGINAL_AUTHOR = "Farhan-Khan";

module.exports.config = {
  name: "asami",
  version: "1.0.0",
  hasPermssion: 0,
  credits: ORIGINAL_AUTHOR, // 🔒 LOCKED
  description: "Wanted Criminal meme edit 🚨",
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

  let targetID = null;
  let targetName = "Criminal";

  // মিরাই বটের মেনশন ও রিপ্লাই ধরার সিস্টেম
  if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    targetName = mentions[targetID].replace("@", ""); 
  } else if (messageReply) {
    targetID = messageReply.senderID;
    try {
      const userInfo = await api.getUserInfo(targetID);
      targetName = userInfo[targetID]?.name || "Criminal";
    } catch (err) {
      targetName = "Criminal";
    }
  }

  if (!targetID) {
    return api.sendMessage("আরে ভাই, কোন আসামিরে ধরব তারে মেনশন বা রিপ্লাই দে! 🚨", threadID, messageID);
  }

  const filePath = path.join(cacheDir, `wanted_milon_${Date.now()}.png`);

  try {
    // 🖼️ আপনার দেওয়া নতুন লিংক
    const imgLink = "https://i.imgur.com/eD4nkVu.jpeg"; 
    const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
    const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

    const [baseImage, targetPfp] = await Promise.all([
      loadImage(imgLink),
      loadImage(targetPfpUrl)
    ]);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // ব্যাকগ্রাউন্ড আঁকা
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // 📏 প্রোফাইল পিকচারের নতুন সাইজ এবং পজিশন
    const pfpSize = 420; // ছবির ফ্রেম অনুযায়ী সাইজ
    
    // X-axis: ছবিটাকে অটোমেটিক মাঝখানে বসানোর জন্য
    const x = (canvas.width - pfpSize) / 2; 
    
    // Y-axis: ওপর থেকে কতটা নিচে নামবে
    const y = 300; 

    ctx.save();
    
    // প্রোফাইল পিকচারটি গোল করার জন্য
    ctx.beginPath();
    ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(targetPfp, x, y, pfpSize, pfpSize);
    ctx.restore();

    // ছবির চারপাশে একটি ভিনটেজ স্টাইলের গাঢ় খয়েরি বর্ডার দেওয়া
    ctx.beginPath();
    ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#3e2723"; // গাঢ় খয়েরি রং
    ctx.stroke();

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    const finalCaption = `🚨 ভয়ংকর ফেরারি আসামি! 🚨\n\nনাম: ${targetName}\nঅপরাধ: মানুষের মন চুরি করা এবং ইনবক্সে রিপ্লাই না দেওয়া! 🤣\nধরিয়ে দিলে আকর্ষণীয় পুরস্কার আছে! 🚓`;

    return api.sendMessage({
      body: finalCaption,
      mentions: [{ tag: targetName, id: targetID }],
      attachment: fs.createReadStream(filePath)
    }, threadID, () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, messageID);

  } catch (e) {
    console.error("WANTED ERROR:", e);
    // ⚠️ API Error Message
    return api.sendMessage("❌ API error call boss milon", threadID, messageID);
  }
};
