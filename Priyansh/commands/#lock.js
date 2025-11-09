const fs = require("fs");
const path = __dirname + "/aaryan/aaryan.json";

module.exports.config = {
  name: "lockname",
  version: "1.0.3",
  hasPermssion: 1,
  credits: "Fixed by ChatGPT | Original: SHANKAR SUMAN",
  description: "Group name ko lock karta hai — sirf admin hi change kar sakta hai",
  commandCategory: "System",
  usages: "/lockname on | off",
  cooldowns: 3
};

module.exports.onLoad = () => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 2));
};

module.exports.handleEvent = async function({ api, event, Threads }) {
  const { threadID, isGroup, author } = event;
  if (!isGroup) return;

  const data = JSON.parse(fs.readFileSync(path));
  let threadInfo = (await Threads.getData(threadID)).threadInfo || {};
  const currentName = threadInfo.threadName;

  if (!data[threadID]) {
    data[threadID] = { namebox: currentName, status: false };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return;
  }

  
  if (data[threadID].status === true && currentName !== data[threadID].namebox) {
    
    const admins = threadInfo.adminIDs.map(e => e.id);
    
    if (!admins.includes(author)) {
      api.setTitle(data[threadID].namebox, threadID, () => {
        api.sendMessage("⚠️ सिर्फ एडमिन ही ग्रुप का नाम बदल सकता है!", threadID);
      });
    } else {
    
      data[threadID].namebox = currentName;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }
  }
};

module.exports.run = async function({ api, event, args, Threads }) {
  const { threadID } = event;
  const data = JSON.parse(fs.readFileSync(path));
  const threadInfo = (await Threads.getData(threadID)).threadInfo || {};
  const currentName = threadInfo.threadName;

  if (!data[threadID]) data[threadID] = { namebox: currentName, status: false };

  if (args[0] === "on") {
    data[threadID].status = true;
    data[threadID].namebox = currentName;
    api.sendMessage("✅ Group name lock हो गया! अब सिर्फ admin ही नाम बदल सकते हैं.", threadID);
  } else if (args[0] === "off") {
    data[threadID].status = false;
    api.sendMessage("🔓 Group name unlock हो गया! अब कोई भी नाम बदल सकता है.", threadID);
  } else {
    return api.sendMessage("⚙️ Use: /lockname on | off", threadID);
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
