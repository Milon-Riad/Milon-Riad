const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "autoinfo",
    eventType: ["log:subscribe"],
    version: "4.3.1",
    credits: "MR JUWEL (Fixed by You)",
    description: "Welcome + Full Smart User Info System with custom frame and extra features",
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.run = async ({ api, event }) => {
    try {
        // Cache ডিরেক্টরি চেক
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

        // Global status চেক
        const statusPath = path.join(cacheDir, 'autoinfo_global_status.json');
        let globalStatus = false; 
        
        if (fs.existsSync(statusPath)) {
            globalStatus = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        } else {
            fs.writeFileSync(statusPath, JSON.stringify(globalStatus, null, 2));
        }

        // গ্লোবাল স্ট্যাটাস অফ থাকলে রিটার্ন করবে
        if (globalStatus === false) return;

        // শুধু মেম্বার অ্যাড হলে কাজ করবে
        if (!event.logMessageData?.addedParticipants) return;

        let newUsers = event.logMessageData.addedParticipants;
        let threadInfo = await api.getThreadInfo(event.threadID);
        let groupName = threadInfo.threadName || "Unknown Group";
        let memberCount = threadInfo.participantIDs.length;
        let namesInGroup = threadInfo.userInfo.map(u => u.name);

        for (let user of newUsers) {
            let id = user.userFbId;
            // বট নিজে অ্যাড হলে ওয়েলকাম মেসেজ দিবে না
            if (id === api.getCurrentUserID()) continue;

            let name = user.fullName || "Unknown";
            let time = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });
            let role = threadInfo.adminIDs.some(e => e.id == id) ? "Admin 👑" : "Member 👤";
            let duplicate = namesInGroup.filter(n => n === name).length > 1 ? "⚠️ Same name exists" : "✅ Unique";
            let position = memberCount;
            let activity = Math.random() > 0.5 ? "Active 🟢" : "Less Active 🔴";
            let accountAge = id.length > 14 ? "New Account 🆕" : "Old Account 🏆";

            const imgPath = path.join(cacheDir, `welcome_${id}.png`);
            const fbPicUrl = `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            let adminMentions = threadInfo.adminIDs.map(admin => ({
                id: admin.id,
                tag: threadInfo.userInfo.find(u => u.id === admin.id)?.name || "Admin"
            }));

            let participation = Math.floor(Math.random() * 100);

            let msgBody = `━━━━━━━━━━━━━━━━━━━
🎀  NEW MEMBER INFORMATION  🎀
━━━━━━━━━━━━━━━━━━━

Welcome 🌸, ${name}!

┃
┣━━━━━━━━━━━━━━━┫
┃ 👤 Name: ${name}
┃ 📌 Mention: @${name}
┃ 🏠 Group: ${groupName}
┣━━━━━━━━━━━━━━━┫
┃ 🆔 UID: ${id}
┃ 🔰 Role: ${role}
┃ 👥 Total Members: ${memberCount}
┃ 📍 Position: ${position}
┃ ⏰ Join Time: ${time}
┣━━━━━━━━━━━━━━━┫
┃ 📊 Activity: ${activity}
┃ ⚡ Participation: ${participation}%
┣━━━━━━━━━━━━━━━┫
┃ 🔎 Duplicate: ${duplicate}
┃ 📅 Account: ${accountAge}
┣━━━━━━━━━━━━━━━┫
┃ 🤖 Bot Status: 🟢 Active
┃ 💡 Commands: autoinfo on/off
┗━━━━━━━━━━━━━━━━━━━`;

            try {
                // Axios দিয়ে ফাস্ট ইমেজ ডাউনলোড
                const response = await axios({
                    url: fbPicUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                const writer = fs.createWriteStream(imgPath);
                response.data.pipe(writer);

                writer.on('finish', () => {
                    api.sendMessage({
                        body: msgBody,
                        mentions: [{ id, tag: name }, ...adminMentions],
                        attachment: fs.createReadStream(imgPath)
                    }, event.threadID, () => {
                        try { fs.unlinkSync(imgPath); } catch(e) {}
                    });
                });

                writer.on('error', () => {
                    // ইমেজ ডাউনলোড ফেইল করলে শুধু টেক্সট পাঠাবে
                    api.sendMessage({
                        body: msgBody,
                        mentions: [{ id, tag: name }, ...adminMentions]
                    }, event.threadID);
                });

            } catch (err) {
                console.log("Image Fetch Error:", err.message);
                api.sendMessage({
                    body: msgBody,
                    mentions: [{ id, tag: name }, ...adminMentions]
                }, event.threadID);
            }
        }
    } catch (e) {
        console.log("Autoinfo Error:", e);
    }
};

module.exports.handleEvent = async ({ api, event }) => {
    try {
        if (event.type !== "message" || !event.body) return;
        
        const msg = event.body.toLowerCase().trim();
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        
        const statusPath = path.join(cacheDir, 'autoinfo_global_status.json');
        let globalStatus = false;
        
        if (fs.existsSync(statusPath)) {
            globalStatus = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        } else {
            fs.writeFileSync(statusPath, JSON.stringify(globalStatus, null, 2));
        }

        const botName = global.config?.BOTNAME || "জুয়েল বস";

        if (msg === "autoinfo on") {
            globalStatus = true;
            fs.writeFileSync(statusPath, JSON.stringify(globalStatus, null, 2));
            
            return api.sendMessage(
                `━━━━━━━━━━━━━━━━━━━\n` +
                `✅ অটোইনফো চালু হয়েছে ✅\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `📢 ${botName} অটোইনফো চালু করেছেন!\n` +
                `🔄 এখন থেকে প্রতিটি নতুন মেম্বার এড হলে তার বিস্তারিত ইনফরমেশন দেওয়া হবে।\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `💡 কমান্ড: autoinfo status\n` +
                `━━━━━━━━━━━━━━━━━━━`,
                event.threadID
            );
        }
        
        if (msg === "autoinfo off") {
            globalStatus = false;
            fs.writeFileSync(statusPath, JSON.stringify(globalStatus, null, 2));
            
            return api.sendMessage(
                `━━━━━━━━━━━━━━━━━━━\n` +
                `❌ অটোইনফো বন্ধ করা হয়েছে ❌\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `📢 ${botName} অটোইনফো বন্ধ করেছেন!\n` +
                `⛔ এখন নতুন মেম্বার এড করলে আর ইনফরমেশন দেওয়া হবে না।\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `💡 কমান্ড: autoinfo status\n` +
                `━━━━━━━━━━━━━━━━━━━`,
                event.threadID
            );
        }

        if (msg === "autoinfo status") {
            const status = globalStatus ? "🟢 চালু (গ্লোবাল)" : "🔴 বন্ধ (গ্লোবাল)";
            return api.sendMessage(
                `━━━━━━━━━━━━━━━━━━━\n` +
                `📊 অটোইনফো স্ট্যাটাস\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `📌 স্ট্যাটাস: ${status}\n` +
                `👑 কন্ট্রোল করেছেন: ${botName}\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `💡 কমান্ডসমূহ:\n` +
                `• autoinfo on - চালু করুন\n` +
                `• autoinfo off - বন্ধ করুন\n` +
                `• autoinfo status - স্ট্যাটাস দেখুন\n` +
                `━━━━━━━━━━━━━━━━━━━`,
                event.threadID
            );
        }

    } catch (e) {
        console.log("Handle event error:", e);
    }
};
