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
	if (event.body.indexOf("@सलोनी")==0 || event.body.indexOf("Saloni")==0 || event.body.indexOf("saloni")==0 || event.body.indexOf("Churail")==0) {
		var msg = {
				body: "հααψε  кιтиʝ вєαυтιfυℓℓ нαι\n 💞 нυмαяι 😘 🅕🅘🅩🅐  🥰🥰♥️🌹",
				attachment: fs.createReadStream(__dirname + `/noprefix/saloni.jpeg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🗡", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
