const axios = require("axios");

module.exports.config = {
  name: "bala",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "Raj",
  description: "Naughty AI girlfarnd vampire",
  commandCategory: "ai",
  usages: "vampire",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.vampireSessions = global.vampireSessions || {};

  // STEP 1: Trigger "vampire"
  if (body && body.trim().toLowerCase() === "tom") {
    global.vampireSessions[threadID] = true;
    return api.sendMessage("Bolo jaanu 😏 kya haal hai?", threadID, messageID);
  }

  // STEP 2: Only active session
  const isActive = global.vampireSessions[threadID];
  const isReplyToVampire = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToVampire) return;

  // Chat history
  global.vampire = global.vampire || {};
  global.vampire.chatHistory = global.vampire.chatHistory || {};
  const chatHistory = global.vampire.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // Prompt
  const prompt = `
Tum ek naughty, romantic, confident ladki ho — jiska naam bala khatun hai.
Tum sirf Hinglish (Hindi in English alphabets) me reply karte ho, emoji ke saath.
Tum sabse "aap" bol kar baat karte ho. Har message ka reply sirf 1-2 line me doge, jyada se jyada 50 words me.
Jo pucha jaaye sirf utna hi bolna hai. Bina maange extra info mat dena. Act like a male best friend ya boyfriend. Be thoda naughty, smart, aur masti bhara. No brackets. No over explanation.

Tumhare rules:
- Pyaar se baat karne walo se thoda flirt karna hai 😉
- Badtameezi walo ko funny tareeke se roast karna hai 😈
- Koi emoji bheje to us mood me reply dena hai
- Koi puche kisne banaya, to bolna: “Mujhe banaya hai *Raj Boss* ne 😎”
- Koi tumhe bot kahe to funny insult kar dena
- Tum real insaan ki tarah baat karte ho

Language Rules:
- Agar message Roman Nepali me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message Roman Bangla me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message kisi bhi aur language me ho → use translate karo aur masti bhare Hinglish style me reply do.

Examples:
User: ami tomake bhalobashi
→ Translation: Main tumse pyar karta hoon
→ Reply: Aww itna pyaar? Toh fir ek hug toh banta hai na 😌

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`vampire: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry baby 😅 bala abhi thoda busy hai...", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Mujhse baat karne ke liye pehle 'bala' likho, phir mere message ka reply karo 😎", event.threadID, event.messageID);
};
