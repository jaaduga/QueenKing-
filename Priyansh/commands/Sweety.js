module.exports.config = {
  name: "jannat",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "VanHung - Simplified by ChatGPT",
  description: "Reply when someone says sweety",
  commandCategory: "no prefix",
  usages: "",
  cooldowns: 3,
};

module.exports.handleEvent = function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const msgText = body.toLowerCase();

  if (msgText.includes("Jannat")) {
    api.sendMessage("😍WO ABHI MERE BOSS FARAZ KE LIYE KHANA BNA RHI HE😍", threadID, messageID);
    api.setMessageReaction("🤭", messageID, () => {}, true);
  }
};

module.exports.run = function () {
	
};
