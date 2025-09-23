const fs = require("fs");

module.exports.config = {
  name: "jannt",
  version: "1.0",
  hasPermission: 0,
  credits: "faraz",
  description: "Send picture based on name without prefix (images stored inside file)",
  commandCategory: "no prefix",
  usages: "Just type the name",
  cooldowns: 1
};

// 🖼️ यहां अपनी images base64 में रखो
const namePicList = {
  "@Jannat Khan": "https://i.imgur.com/fdYIw39.jpeg",
  "jannat": "https://i.imgur.com/cB5rJNL.jpeg",
  "jannt": "https://i.imgur.com/ImJttgI.jpeg",
};

// Convert base64 to buffer and send
module.exports.handleEvent = async function ({ api, event }) {
  const text = event.body?.toLowerCase();
  if (!text) return;

  if (namePicList[text]) {
    try {
      const base64Data = namePicList[text].split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      return api.sendMessage(
        {
          body: `📷 Picture for: ${text}`,
          attachment: buffer
        },
        event.threadID,
        event.messageID
      );
    } catch (err) {
      console.error(err);
      return api.sendMessage("⚠️ Error sending picture.", event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function () {};
