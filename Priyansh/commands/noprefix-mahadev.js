const fs = require("fs");
module.exports.config = {
	name: "mahadev2",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "MrTomXxX", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "mahadev",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("har har mahadev")==0 || event.body.indexOf("Har har Mahadev")==0 || event.body.indexOf("Bhole")==0 || event.body.indexOf("Shiv")==0) {
		var msg = {
				body: "𝙷𝚊𝚛 𝚑𝚊𝚛 𝚖𝚊𝚑𝚊𝚍𝚎𝚟♥️ 𝙹𝚊𝚒 𝚖𝚊𝚑𝚊𝚔𝚊𝚕🌹",
				attachment: fs.createReadStream(__dirname + `/noprefix/mahadev.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🔱", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
