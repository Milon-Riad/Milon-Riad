const axios = require("axios");

// Goatbot / Dipto API Link
const baseApiUrl = "https://noobs-api.top/dipto/baby";

module.exports.config = {
 name: "baby",
 version: "1.0.3",
 hasPermssion: 0,
 credits: "MILON",
 description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
 commandCategory: "Chat",
 usages: "[message/query]",
 cooldowns: 0,
 prefix: true
};

module.exports.run = async function ({ api, event, args }) {
 try {
 const uid = event.senderID;
 const rawQuery = args.join(" ");
 const query = rawQuery.toLowerCase();

 if (!query) {
 const ran = ["Bolo baby", "hum", "ki koro jaan?"];
 const r = ran[Math.floor(Math.random() * ran.length)];
 return api.sendMessage(r, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 });
 }

 const command = args[0].toLowerCase();

 // Remove API
 if (["remove", "rm"].includes(command)) {
 const parts = rawQuery.replace(/^(remove|rm)\s*/i, "").split(/\s*-\s*/);
 if (parts.length === 2 && !isNaN(parts[1])) {
 // rm ask - index
 const res = await axios.get(`${baseApiUrl}?remove=${encodeURIComponent(parts[0])}&index=${parts[1]}`);
 return api.sendMessage(res.data.message || "Removed successfully!", event.threadID, event.messageID);
 } else {
 // remove ask
 const ask = parts[0] || rawQuery.replace(/^(remove|rm)\s*/i, "").trim();
 const res = await axios.get(`${baseApiUrl}?remove=${encodeURIComponent(ask)}&senderID=${uid}`);
 return api.sendMessage(res.data.message || "Removed successfully!", event.threadID, event.messageID);
 }
 }

 // List API
 if (command === "list") {
 const res = await axios.get(`${baseApiUrl}?list=all`);
 if (res.data) {
 return api.sendMessage(
 `❇️ | Total Teach = ${res.data.length || "0"}\n♻️ | Total Response = ${res.data.responseLength || "0"}`,
 event.threadID, event.messageID
 );
 } else return api.sendMessage(`Error getting list`, event.threadID, event.messageID);
 }

 // Edit API
 if (command === "edit") {
 const parts = rawQuery.replace(/^edit\s*/i, "").split(/\s*-\s*/);
 if (parts.length < 2) return api.sendMessage("Use: edit [Question] - [NewReply]", event.threadID, event.messageID);
 const ask = parts[0];
 const newReply = parts[1];
 const res = await axios.get(`${baseApiUrl}?edit=${encodeURIComponent(ask)}&replace=${encodeURIComponent(newReply)}&senderID=${uid}`);
 return api.sendMessage(`changed ${res.data.message || 'success'}`, event.threadID, event.messageID);
 }

 // Teach API
 if (command === "teach") {
 const parts = rawQuery.replace(/^teach\s*/i, "").split(/\s*-\s*/);
 if (parts.length < 2) return api.sendMessage("Use: teach [Question] - [Reply]", event.threadID, event.messageID);
 const ask = parts[0];
 const ans = parts[1];
 const res = await axios.get(`${baseApiUrl}?teach=${encodeURIComponent(ask)}&reply=${encodeURIComponent(ans)}&senderID=${uid}&threadID=${event.threadID}`);
 return api.sendMessage(`✅ Replies added: ${res.data.message}`, event.threadID, event.messageID);
 }

 // Normal Chat API
 const res = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(query)}&senderID=${uid}&font=1`);
 const reply = res.data.reply;

 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 }, event.messageID);

 } catch (err) {
 return api.sendMessage(`API Error: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleReply = async function ({ api, event }) {
 try {
 const replyText = event.body ? event.body.toLowerCase() : "";
 if (!replyText) return;
 
 const res = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(replyText)}&senderID=${event.senderID}&font=1`);
 const reply = res.data.reply;

 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 }, event.messageID);

 } catch (err) {
 return api.sendMessage(`API Error: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleEvent = async function ({ api, event }) {
 try {
 const raw = event.body ? event.body.toLowerCase().trim() : "";
 if (!raw) return;
 const senderID = event.senderID;

const greetings = [
        "বেশি bot Bot করলে leave নিবো কিন্তু😒😒",
        "শুনবো না😼 তুমি আমার বস মিলন কে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
        "আমি আবাল দের সাথে কথা বলি না,ok😒",
        "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈",
        "Bolo Babu, তুমি কি আমার বস মিলন কে ভালোবাসো? 🙈💋",
        "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
        "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?",
        "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬",
        "I love you janu🥰",
        "আরে Bolo আমার জান ,কেমন আছো?😚",
        "আজ বট বলে অসম্মান করছিস,😰😿",
        "Hop beda😾,Boss বল boss😼",
        "চুপ থাক ,নাই তো তোর দাঁত ভেঙ্গে দিবো কিন্তু",
        "আমাকে না ডেকে মেয়ে হলে বস মিলনের ইনবক্সে চলে যা 🌚😂 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/share/1CNLskKAtw/",
        "আমাকে বট না বলে , বস মিলন কে জানু বল জানু 😘",
        "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋",
        "আরে বলদ এতো ডাকিস কেন🤬",
        "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘",
        "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",
        "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘",
        "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣",
        "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
        "আমাকে ডেকো না,আমি বস মিলনে সাথে ব্যাস্ত আছি",
        "কি হলো , মিস্টেক করচ্ছিস নাকি🤣",
        "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
        "জান মেয়ে হলে বস মিলনের ইনবক্সে চলে যাও 😍🫣💕 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/share/1CNLskKAtw/",
        "কালকে দেখা করিস তো একটু 😈",
        "হা বলো, শুনছি আমি 😏",
        "আর কত বার ডাকবি ,শুনছি তো",
        "হুম বলো কি বলবে😒",
        "বলো কি করতে পারি তোমার জন্য",
        "আমি তো অন্ধ কিছু দেখি না🐸 😎",
        "আরে বোকা বট না জানু বল জানু😌",
        "বলো জানু 🌚",
        "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
        "হুম জান তোর নানীরে উম্মাহ 😑😘",
        "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
        "jang hanga korba😒😬",
        "হুম জান তোমারে উম্মমাহ😷😘",
        "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰",
        "ভালোবাসার নামক আবলামি করতে চাইলে বস মিলনের ইনবক্সে গুতা দিন ~🙊😘🤣 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/share/1CNLskKAtw/",
        "আমাকে এতো না ডেকে বস মিলন কে একটা গফ দে 🙄",
        "আমাকে এতো না ডেকছ কেন ভলো টালো বাসো নাকি🤭🙈",
        "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻",
        "আমি এখন বস মিলন এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
        "আমাকে না ডেকে আমার বস মিলন কে একটা জি এফ দাও-😽🫶🌺",
        "ঝাং থুমালে আইলাপিউ পেপি-💝😽",
        "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
        "জান তোমার বান্ধবী রে আমার বস মিলনের হাতে তুলে দিবা-🙊🙆‍♂",
        "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
        "ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦",
        "চুনা ও চুনা আমার বস মিলন এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭",
        "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",
        "জান কিস দিবা-🙊😝🌻",
        "জান মেয়ে হলে চিপায় আসো বস মিলনের থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
        "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼",
        "আমার বস মিলনের পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস মিলন ইসলামে'র জন্য দোয়া করবেন-💝💚🌺🌻",
        "- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস মিলন এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:- https://www.facebook.com/share/1CNLskKAtw/",
        "আমার জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
        "কিরে প্রেম করবি তাহলে বস মিলনের ইনবক্সে গুতা দে 😘🤌 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/share/1CNLskKAtw/",
        "জান আমার বস মিলন কে বিয়ে করবা-🙊😘🥳",
        "-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦",
        "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂",
        "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস মিলন কে দান করেন-🥱🐰🍒",
        "-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧",
        "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস মিলন কে-🐸😾🔪",
        "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧",
        "-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸",
        "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
        "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",
        "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗",
        "কি ব্যাপার, আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻",
        "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",
        "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻",
        "-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻",
        "প্রেম করতে চাইলে বস মিলনের ইনবক্সে চলে যা 😏🐸 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/share/1CNLskKAtw/",
        "-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস মিলন ধরতে পারছে না-🐸🥲",
        "-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️",
        "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস মিলন এর সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗",
        "—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস সাহু এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️",
        "-রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜",
        "সুন্দর মাইয়া মানেই-🥱আমার বস মিলনে'র বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗",
        "এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂",
        "-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸",
        "ভালোবাসার নামক আবলামি করতে চাইলে বস সাহুর ইনবক্সে গুতা দিন🤣😼",
        "মেয়ে হলে বস মিলনের ইনবক্সে চলে যা 🤭🤣😼 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/share/1CNLskKAtw/",
        "হুদাই আমারে শয়তানে লারে-😝😑☹️",
        "-𝗜 𝗟𝗢𝗩𝗘 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸",
        "-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦",
        "-কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧",
        "-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱",
        "-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋",
        "-ইস কেউ যদি বলতো-🙂-আমার শুধু তোমাকেই লাগবে-💜🌸",
        "-ওই বেডি তোমার বাসায় না আমার বস মিলন মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস মিলন কে জানে মারার কি দরকার-🙄🤧",
        "-একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে ওর মতো আর কেউ ভালবাসেনি-🙂😅",
        "-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧",
        "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦",
        "-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস মিলনের এর মনটা ছাড়া-🥴😑😏",
        "-🫵তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵",
        "-আজ থেকে আর কাউকে পাত্তা দিমু চিহ্নিত না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸"
      ];

 // Auto Reply when only name is called
 if (
 raw === "baby" || raw === "bot" || raw === "bby" ||
 raw === "jan" || raw === "xan" || raw === "জান" ||
 raw === "বট" || raw === "বেবি"
 ) {
 const randomReply = greetings[Math.floor(Math.random() * greetings.length)];
 return api.sendMessage(randomReply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: senderID,
 type: "simsimi"
 });
 }
 }, event.messageID);
 }

 // API Call when called with a message
 if (
 raw.startsWith("baby ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||
 raw.startsWith("jan ") || raw.startsWith("xan ") ||
 raw.startsWith("জান ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")
 ) {
 const query = raw.replace(/^baby\s+|^bot\s+|^bby\s+|^jan\s+|^xan\s+|^জান\s+|^বট\s+|^বেবি\s+/i, "").trim();
 if (!query) return;

 const res = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(query)}&senderID=${senderID}&font=1`);
 const reply = res.data.reply;

 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: senderID,
 type: "simsimi"
 });
 }
 }, event.messageID);
 }

 } catch (e) {
  // Ignore handleEvent errors to prevent spam
 }
};
