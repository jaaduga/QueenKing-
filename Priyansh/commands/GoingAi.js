const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 🔒 HARD-LOCK CREDITS PROTECTION 🔒
function protectCredits(config) {
  if (config.credits !== "ARIF-BABU") {
    config.credits = "ARIF-BABU";
    throw new Error("❌ Credits are LOCKED by ARIF-BABU 🔥");
  }
}

module.exports.config = {
  name: "ARIF-AI",
  version: "2.6.4",
  hasPermssion: 0,
  credits: "ARIF-BABU",
  description: "Exact/End Bot = fixed reply | Bot xyz = AI",
  commandCategory: "ai",
  usages: "bot",
  cooldowns: 2,
  dependencies: { axios: "" }
};

protectCredits(module.exports.config);

// 📁 PATHS
const HISTORY_FILE = path.join(__dirname, "ARIF-BABU", "ai_history.json");
const BOT_REPLY_FILE = path.join(__dirname, "ARIF-BABU", "bot-reply.json");

// 🧠 LOAD HISTORY
let historyData = fs.existsSync(HISTORY_FILE)
  ? JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"))
  : {};

// 🤖 LOAD BOT REPLIES
let botReplies = fs.existsSync(BOT_REPLY_FILE)
  ? JSON.parse(fs.readFileSync(BOT_REPLY_FILE, "utf8"))
  : {};

// 🌸 SYSTEM PROMPT
const systemPrompt = `
You are cute Babu, a calm and sweet boy.
Creator & Owner: Feroz Babu (sirf wahi).
Feroz Babu ki baat hi final hogi, koi aur nahi sun sakta.
Agar koi bole "AI bolo", toh jawab hoga: "Main cute Babu AI hoon 🙂❤️😌"
Reply hamesha soft Hindi mein.
Sirf 1–2 lines.
Use 🙂❤️😌
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  protectCredits(module.exports.config);

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const rawText = body.trim();
  const text = rawText.toLowerCase();

  // 🟢 FIXED BOT CONDITIONS
  const fixedBot =
    text === "bot" ||
    text === "bot." ||
    text === "bot!" ||
    text.endsWith(" bot"); // kha ho bot, kaha ho bot

  // 🟢 BOT + TEXT (AI)
  const botWithText = text.startsWith("bot ");

  // 🟢 REPLY TO BOT MESSAGE
  const replyToBot =
    messageReply &&
    messageReply.senderID === api.getCurrentUserID();

  // =========================
  // 🤖 FIXED BOT REPLY (bot-reply.json)
  // =========================
  if (fixedBot && !botWithText) {
    let category = "MALE";

    if (senderID === "61572909482910") {
      category = "61572909482910";
    } else if (
      event.userGender === 1 ||
      event.userGender?.toString().toUpperCase() === "FEMALE"
    ) {
      category = "FEMALE";
    }

    const replies = botReplies[category] || [];
    if (replies.length) {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      api.sendMessage(reply, threadID, messageID);
      api.setMessageReaction("✅", messageID, () => {}, true);
    }
    return; // ❌ AI yahin stop
  }

  // ❌ AI tabhi chale jab:
  // bot + text  OR  reply to bot
  if (!botWithText && !replyToBot) return;

  // =========================
  // 🤖 AI REPLY
  // =========================
  if (!historyData[senderID]) historyData[senderID] = [];

  historyData[senderID].push(`User: ${rawText}`);
  if (historyData[senderID].length > 6)
    historyData[senderID].shift();

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2));

  const finalPrompt =
    systemPrompt +
    "\n" +
    historyData[senderID].join("\n") +
    "\nArif Babu:";

  api.setMessageReaction("⌛", messageID, () => {}, true);

  let res;
  try {
    res = await axios.get(
      `https://text.pollinations.ai/${encodeURIComponent(finalPrompt)}`,
      { timeout: 15000 }
    );
  } catch {
    return api.sendMessage(
      "थोड़ा सा रुक जाओ 😌 अभी सोच रहा हूँ ❤️",
      threadID,
      messageID
    );
  }

  let reply =
    typeof res.data === "string"
      ? res.data.trim()
      : res.data.text || "मैं यहीं हूँ 🙂";

  reply = reply.split("\n").slice(0, 2).join(" ");
  if (reply.length > 150)
    reply = reply.slice(0, 150) + "… 🙂";

  historyData[senderID].push(`Bot: ${reply}`);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2));

  api.sendTypingIndicator(threadID, true);
  await new Promise(r => setTimeout(r, 1200));
  api.sendTypingIndicator(threadID, false);

  api.sendMessage(reply, threadID, messageID);
  api.setMessageReaction("✅", messageID, () => {}, true);
};
