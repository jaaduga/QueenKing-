const fs = require("fs");
module.exports.config = {
	name: "umar",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "MrTomXxX", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "tea",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("@Umar Malik")==0 || event.body.indexOf("UMAR")==0 || event.body.indexOf("umar")==0 || event.body.indexOf("Umariya")==0) {
		var msg = {
				body: "𝗛𝗲 𝗶𝘀 𝗕𝗲𝘀𝘁 𝗙𝗿𝗶𝗲𝗻𝗱 𝗢𝗳 𝗠𝘆 𝗕𝗼𝘀𝘀 𝗳𝗮𝗿𝗮𝘇 \n 💞 \n 🌹Umar Malik 😘♥️🌹",
				attachment: fs.createReadStream(__dirname + `/noprefix/uamar.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🍿", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
