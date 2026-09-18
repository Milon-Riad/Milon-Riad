const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

// --- Helper Functions ---
async function circleCrop(buffer, size) {
    const img = await loadImage(buffer);
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, 0, 0, size, size);
    return canvas;
}

async function makeImage(one, two) {
    const bgURL = "https://i.postimg.cc/KYJ0VnK0/image0.png";
    const bg = await loadImage(bgURL);

    const width = 640;
    const height = 480;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, width, height);

    const fetchPfp = async (id) => {
        const url = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        return (await axios.get(url, { responseType: "arraybuffer" })).data;
    };

    const avtOne = await fetchPfp(one);
    const avtTwo = await fetchPfp(two);

    const circle1 = await circleCrop(avtOne, 110); // PFP 1 -> size 110
    const circle2 = await circleCrop(avtTwo, 90);  // PFP 2 -> size 90

    // Swap positions
    ctx.drawImage(circle1, 60, 150); // Sender goes to hitting position
    ctx.drawImage(circle2, 500, 220);  // Target goes to bonked position

    // Mirai এর স্ট্যান্ডার্ড cache ফোল্ডার
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const outPath = path.join(cacheDir, `bonk_${one}_${two}_${Date.now()}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
    return outPath;
}

// --- Module Export (Mirai Standard) ---
module.exports.config = {
    name: "bonk",
    aliases: ["b"],
    version: "1.0",
    hasPermssion: 0,
    credits: "Meheraz | rewrite by Muzan",
    description: "Make a BONK meme using two avatars",
    commandCategory: "fun",
    usages: "[reply / mention / uid]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { threadID, messageID, senderID, mentions, messageReply } = event;

        let targetID;

        // Mirai তে রিপ্লাই চেক করার নিয়ম
        if (event.type === "message_reply" || messageReply?.senderID) {
            targetID = messageReply.senderID;
        } 
        else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        } 
        else if (args[0] && /^\d+$/.test(args[0])) {
            targetID = args[0];
        } 
        else {
            return api.sendMessage("⚠ Reply / Mention / UID use koro.", threadID, messageID);
        }

        const one = senderID;
        const two = targetID;

        // টার্গেট আইডির নাম বের করা হচ্ছে
        let targetName = "User";
        try {
            const userInfo = await api.getUserInfo(targetID);
            targetName = userInfo[targetID]?.name || "User";
        } catch (e) {
            // যদি নাম না পাওয়া যায়, তাহলে ম্যানশন থেকে নাম নেওয়ার চেষ্টা করবে
            if (Object.keys(mentions).length > 0) {
                targetName = mentions[targetID].replace("@", "");
            }
        }

        const file = await makeImage(one, two);

        return api.sendMessage(
            {
                body: `${targetName} bonk nigga 🪓`,
                attachment: fs.createReadStream(file),
            },
            threadID,
            () => {
                if (fs.existsSync(file)) {
                    try {
                        fs.unlinkSync(file);
                    } catch (e) {
                        console.error("Cache clear error:", e);
                    }
                }
            },
            messageID
        );
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
    }
};
