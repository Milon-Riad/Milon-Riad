// 🔒 ORIGINAL AUTHOR LOCK
const ORIGINAL_AUTHOR = "𝕸𝖎𝖑𝖔𝖓";

module.exports.config = {
  name: "idage",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝕸𝖎𝖑𝖔𝖓", // 🎯 আপনার স্টাইলিশ নাম
  description: "ইউআইডি দেখে আইডির বয়স অনুমান করে",
  commandCategory: "info",
  usages: "[@mention] / [uid] / [reply]",
  cooldowns: 5
};

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---
 * 🤖 BOT NAME: ─꯭─⃝͎̽𓆩মিঁলঁনেঁরঁ ফেঁমাঁসঁ বঁটঁ‣᭄𓆪___//😽🩵🪽
 * 👤 OWNER: 𝕸𝖎𝖑𝖔𝖓
 * 🛠️ PROJECT: MILON BOT PROJECT (2026)
 * --------------------------------------- */

// ইউআইডি (UID) থেকে সাল বের করার অ্যাডভান্সড ফাংশন
function getCreationYear(uid) {
  if (!uid || isNaN(uid)) return "অজানা (সঠিক UID নয়)";

  let length = uid.length;

  // খুব পুরোনো আইডি (২০০৪ - ২০০৮)
  if (length <= 4) return "২০০৪ (ফেসবুকের একদম শুরুর দিকে)";
  if (length === 5 || length === 6) return "২০০৪ - ২০০৫ এর দিকে";
  if (length === 7 || length === 8) return "২০০৫ - ২০০৬ এর দিকে";
  if (length === 9) return "২০০৭ - ২০০৮ এর দিকে";
  if (length === 10) return "২০০৮ - ২০০৯ এর দিকে";
  if (length < 15) return "২০০৯ সালের আগে";

  // ১৫ ডিজিটের 10000... সিরিজ (২০০৯ - ২০১৫)
  if (uid.startsWith("10000")) {
    let sub = parseInt(uid.substring(5, 7));
    if (sub === 0) return "২০০৯ সালের শেষের দিকে";
    if (sub === 1) return "২০১০ সালের শুরুর দিকে";
    if (sub === 2 || sub === 3) return "২০১০ - ২০১১ এর দিকে";
    if (sub === 4 || sub === 5) return "২০১১ - ২০১২ এর দিকে";
    if (sub === 6 || sub === 7) return "২০১২ - ২০১৩ এর দিকে";
    if (sub === 8) return "২০১৩ এর শেষে বা ২০১৪ সালের শুরুতে";
    if (sub === 9) return "২০১৪ এর শেষে বা ২০১৫ এর শুরুতে";
  }

  // অন্যান্য 1000... সিরিজ (আরও নিখুঁত হিসাব)
  if (uid.startsWith("10001")) {
    let sub = parseInt(uid.substring(5, 7));
    if (sub <= 1) return "২০১৫ এর মাঝামাঝি বা শেষে";
    if (sub >= 2 && sub <= 4) return "২০১৬ সালের শুরুতে বা মাঝামাঝি";
    if (sub >= 5 && sub <= 7) return "২০১৬ এর শেষে বা ২০১৭ এর শুরুতে";
    if (sub >= 8) return "২০১৭ সালের মাঝামাঝি বা শেষে";
  }

  if (uid.startsWith("10002")) {
    let sub = parseInt(uid.substring(5, 7));
    if (sub <= 2) return "২০১৭ এর শেষে বা ২০১৮ এর শুরুতে";
    if (sub >= 3 && sub <= 6) return "২০১৮ সালের মাঝামাঝি";
    if (sub >= 7) return "২০১৮ এর শেষে বা ২০১৯ এর শুরুতে";
  }

  if (uid.startsWith("10003")) return "২০১৯ সালের মাঝামাঝি বা শেষে";
  if (uid.startsWith("10004")) return "২০১৯ এর শেষে বা ২০২০ এর শুরুতে";
  if (uid.startsWith("10005")) return "২০২০ সালের মাঝামাঝি বা শেষে";
  if (uid.startsWith("10006")) return "২০২০ এর শেষে বা ২০২১ এর শুরুতে";
  if (uid.startsWith("10007")) return "২০২১ সালের মাঝামাঝি বা শেষে";
  if (uid.startsWith("10008")) return "২০২২ সালের শুরুতে বা মাঝামাঝি";
  if (uid.startsWith("10009")) return "২০২২ এর শেষে বা ২০২৩ এর শুরুতে";

  // নতুন মেটা (Meta) আপডেট সিরিজ (6155... বা 6156...)
  if (uid.startsWith("6155")) return "২০২৩ সালের মাঝামাঝি বা শেষে";
  if (uid.startsWith("6156")) return "২০২৪ সালের শুরুতে বা মাঝামাঝি";
  if (uid.startsWith("6157")) return "২০২৪ এর শেষে বা ২০২৫ এর শুরুতে";
  if (uid.startsWith("6158")) return "২০২৫ এর শেষে বা ২০২৬ এর শুরুতে";
  if (uid.startsWith("6159")) return "২০২৬ সালের মাঝামাঝি বা শেষে";

  return "সাম্প্রতিক সময়ে খোলা আইডি (২০২৬ বা তার পরে)";
}

module.exports.run = async function({ api, event, args }) {
  
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

  let uid = event.senderID;
  let name = "Unknown User";

  // আইডি ও নাম বের করার লজিক
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
    name = event.mentions[uid].replace("@", "");
  } else if (args.length > 0 && !isNaN(args[0])) {
    uid = args[0];
  }

  try {
    // ইউজারের নাম সংগ্রহ (যদি মেনশন না করে থাকে)
    if (name === "Unknown User") {
      let userInfo = await api.getUserInfo(uid);
      if (userInfo && userInfo[uid]) {
        name = userInfo[uid].name;
      }
    }

    // আইডির বয়স ক্যালকুলেট
    let ageEstimate = getCreationYear(uid);

    // মেসেজ ফ্রেম তৈরি
    let msg = `╔════════════════════════════════════╗
║ 🔍 ফেসবুক আইডির বয়স অনুসন্ধান
╠════════════════════════════════════╣
║ 👤 নাম: ${name}
║ 🆔 ইউআইডি: ${uid}
║ 📅 আইডি খোলার আনুমানিক সময়: 
║ 👉 ${ageEstimate}
╠════════════════════════════════════╣
║ ⚠️ দ্রষ্টব্য: এটি ইউআইডি সিরিজ অনুযায়ী 
║ অনুমান করা হয়েছে, এটি ১০০% নির্ভুল না-ও 
║ হতে পারে, তবে সর্বোচ্চ ৩-৬ মাস ব্যাবধান থাকতে পারে।
╚════════════════════════════════════╝`;

    // মেসেজ সেন্ড
    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (error) {
    console.error("IDAGE ERROR:", error);
    // ⚠️ API Error Message
    return api.sendMessage("❌ API error call boss milon", event.threadID, event.messageID);
  }
};
