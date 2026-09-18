module.exports.config = {
  name: "testdp",
  version: "1.0.0",
  credits: "Milon",
  description: "Fetch your FB profile picture (for testing)",
  commandCategory: "test",
  usePrefix: true,
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const uid = event.senderID;

    // FB profile picture URL
    const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;

    return api.sendMessage({
      body: "✅ Your DP fetched successfully",
      attachment: await global.utils.getStreamFromURL(url)
    }, event.threadID, event.messageID);

  } catch (err) {
    console.log(err);
    return api.sendMessage("❌ Failed to fetch DP", event.threadID, event.messageID);
  }
};
