const fs = require("fs");
module.exports.config = {
	name: "Fiza",
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
	if (event.body.indexOf("FIZA")==0 || event.body.indexOf("Fiza")==0 || event.body.indexOf("Shibli")==0 || event.body.indexOf("shibli")==0) {
		var msg = {
				body: "հααψε  кιтиʝ вєαυтιfυℓℓ нαι\n 💞 нυмαяι 😘 🅕🅘🅩🅐  🥰🥰♥️🌹",
				attachment: fs.createReadStream(__dirname + `/noprefix/fiza.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🗡", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
