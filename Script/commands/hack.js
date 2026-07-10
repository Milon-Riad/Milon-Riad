module.exports.config = {
    name: "hack",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "experts",
    commandCategory: "Fun",
    usages: "tag or reply",
    cooldowns: 0,
    usePrefix: true
};

module.exports.languages = {
    en: {
        hacked: "This ID has been hacked 😽✔️",
        needTarget: "Please reply or mention someone......",
        error: "Something went wrong."
    },

    bn: {
        hacked: "এই আইডিটা হ্যাক করা হলো 😽✔️",
        needTarget: "Doya kore kauke reply ba mention koren......",
        error: "Kichu ekta problem hoyeche."
    },

    hi: {
        hacked: "Yeh ID hack kar li gayi 😽✔️",
        needTarget: "Kripya kisi ko reply ya mention karein......",
        error: "Kuch problem ho gayi."
    },

    vi: {
        hacked: "ID này đã bị hack 😽✔️",
        needTarget: "Vui lòng reply hoặc mention ai đó......",
        error: "Đã xảy ra lỗi."
    }
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
    if (ctx.measureText(text).width < maxWidth) return [text];
    if (ctx.measureText("W").width > maxWidth) return null;

    const words = text.split(" ");
    const lines = [];
    let line = "";

    while (words.length) {
        while (ctx.measureText(words[0]).width >= maxWidth) {
            const tmp = words[0];
            words[0] = tmp.slice(0, -1);
            words.splice(1, 0, tmp.slice(-1));
        }

        if (ctx.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + " ";
        } else {
            lines.push(line.trim());
            line = "";
        }

        if (!words.length) lines.push(line.trim());
    }

    return lines;
};

module.exports.run = async function ({ api, event, Users, getText }) {
    const { createCanvas, loadImage } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule.axios;

    try {
        let targetID;
        if (event.type === "message_reply") {
            targetID = event.messageReply.senderID;
        } else if (Object.keys(event.mentions).length) {
            targetID = Object.keys(event.mentions)[0];
        }

        if (!targetID) {
            return api.sendMessage(
                getText("needTarget"),
                event.threadID,
                event.messageID
            );
        }

        const name = await Users.getNameUser(targetID);

        fs.ensureDirSync(__dirname + "/cache");

        const bgPath = `${__dirname}/cache/bg_${event.senderID}.png`;
        const avPath = `${__dirname}/cache/avt_${targetID}.png`;

        const bgUrl = "https://drive.google.com/uc?id=1_S9eqbx8CxMMxUdOfATIDXwaKWMC-8ox&export=download";

        const avatar = await axios.get(
            `https://graph.facebook.com/${targetID}/picture?width=512&height=512`,
            { responseType: "arraybuffer" }
        );

        const bg = await axios.get(bgUrl, { responseType: "arraybuffer" });

        fs.writeFileSync(avPath, Buffer.from(avatar.data));
        fs.writeFileSync(bgPath, Buffer.from(bg.data));

        const background = await loadImage(bgPath);
        const avatarImg = await loadImage(avPath);

        const canvas = createCanvas(background.width, background.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(avatarImg, 57, 290, 66, 68);

        ctx.font = "400 23px Arial";
        ctx.fillStyle = "#1878F3";
        ctx.textAlign = "start";

        const lines = await this.wrapText(ctx, name, 1160);
        ctx.fillText(lines.join("\n"), 136, 335);

        const buffer = canvas.toBuffer();
        fs.writeFileSync(bgPath, buffer);
        fs.removeSync(avPath);

        return api.sendMessage(
            { body: getText("hacked"), attachment: fs.createReadStream(bgPath) },
            event.threadID,
            () => fs.unlinkSync(bgPath),
            event.messageID
        );

    } catch (err) {
        console.error(err);
        return api.sendMessage(
            getText("error"),
            event.threadID,
            event.messageID
        );
    }
};
