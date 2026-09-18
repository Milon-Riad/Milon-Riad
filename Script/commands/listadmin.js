module.exports.config = {
    name: "listadmin",
    version: '1.0.0',
    hasPermssion: 0,
    credits: "Milon",
    description: "List of group administrators",
    commandCategory: "Box Chat",
    usages: "dsqtv",
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function({ api, event, args, Users }) {

    var threadInfo = await api.getThreadInfo(event.threadID);

    let qtv = threadInfo.adminIDs.length;
    var listad = '';
    var qtv2 = threadInfo.adminIDs;

    var fs = global.nodemodule["fs-extra"];

    const customNames = {
        "100081225144815": "Milon (ঘুমন্ত বীর)",
        "61587807315292": "Mehedi (অপেক্ষার শেষ প্রহর)",
        "61585052284220": "Milon (jui Islam)",
        "61557992226296": "Easha (Esrat Jahan Easha)",
        "61583718843620": "Nusrat (Nusrat Islam)"
    };

    let dem = 1;

    for (let i = 0; i < qtv2.length; i++) {
        const id = qtv2[i].id;
        const info = await api.getUserInfo(id);
        const name = info[id].name;

        const displayName = customNames[id] || name;

        listad += `${dem++}. ${displayName} (${id})\n`;
    }

    api.sendMessage(
        `👑 The list of ${qtv} administrators includes:\n\n${listad}`,
        event.threadID,
        event.messageID
    );
};
