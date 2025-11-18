module.exports.config = {
  name: "pair",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra X Priyansh",
  description: "Ye jodi likhi hai bhagwan ne - Kalm tha Rudra 👑",
  commandCategory: "love",
  cooldowns: 2,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ Users, Threads, api, event }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const { createCanvas, loadImage } = require("canvas");

  const cachePath = __dirname + `/cache`;
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

  const id1 = event.senderID;
  const name1 = await Users.getNameUser(id1);

  // Thread info
  const threadInfo = await api.getThreadInfo(event.threadID);
  const allUsers = threadInfo.userInfo;
  const botID = api.getCurrentUserID();

  const gender1 = allUsers.find(u => u.id == id1)?.gender || "UNKNOWN";

  // Filter candidates
  let candidates = [];
  for (const u of allUsers) {
    if (u.id !== id1 && u.id !== botID) {
      if (gender1 === "MALE" && u.gender === "FEMALE") candidates.push(u.id);
      else if (gender1 === "FEMALE" && u.gender === "MALE") candidates.push(u.id);
      else if (gender1 === "UNKNOWN") candidates.push(u.id);
    }
  }

  if (candidates.length === 0)
    return api.sendMessage("❌ Koi jodi nahi mili bhai 😔", event.threadID);

  // Choose partner
  const id2 = candidates[Math.floor(Math.random() * candidates.length)];
  const name2 = await Users.getNameUser(id2);

  // Background list
  const backgrounds = [
    "https://i.postimg.cc/wjJ29HRB/background1.png",
    "https://i.postimg.cc/zf4Pnshv/background2.png",
    "https://i.postimg.cc/5tXRQ46D/background3.png"
  ];

  // Shayari list
  const shayaris = [
    "💫 Mohabbat inki taqdeer ban chuki hai 💖",
    "💘 In dono ki jodi pe rab bhi fakr kare 🙏",
    "🌟 Ishq bhi sharma jaaye inke aage 😍",
    "👑 Dil se dil ka milna yeh toh asmaanon ka rishta hai 🕊️",
    "🔥 Ruh ka milan hai yeh, sirf jism ka nahi 💑",
    "🌸 Inka rishta toh janmon ka hai 💍",
    "💌 Pyaar bhi keh raha hai: 'Yeh dono ek doosre ke liye bane hain' 🌈",
    "💎 Jahan tak mohabbat ka asar hai, wahan tak inka naam chalega 💥",
    "🫀 Dil, dua aur kismat — sab milein hain in dono ke naam 💘"
  ];

  // Rating
  const ratings = ["💘 100%", "💫 99.9%", "🔥 98%", "❤️ 101%", "🌟 97.5%", "👑 96.69%", "🕊️ 100.0%"];

  const header = "✨ Ye jodi likhi hai god ne ✨\n💢 Kalm tha... 🦋⃟⃟ ⍣⃝ 𝗙𝗔𝗜𝗭𝗔𝗡➺༆𓆪⃟⍨⃝ 👑";

  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const shayari = shayaris[Math.floor(Math.random() * shayaris.length)];
  const rating = ratings[Math.floor(Math.random() * ratings.length)];

  const imgBG = `${cachePath}/pair_bg.png`;
  const img1 = `${cachePath}/avt1.png`;
  const img2 = `${cachePath}/avt2.png`;

  // Download avatars
  const avt1 = (await axios.get(
    `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(img1, Buffer.from(avt1, "utf-8"));

  const avt2 = (await axios.get(
    `https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(img2, Buffer.from(avt2, "utf-8"));

  // Download background
  const bgImg = (await axios.get(bg, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(imgBG, Buffer.from(bgImg, "utf-8"));

  // Create image
  const base = await loadImage(imgBG);
  const avatar1 = await loadImage(img1);
  const avatar2 = await loadImage(img2);

  const canvas = createCanvas(base.width, base.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(avatar1, 100, 150, 300, 300);
  ctx.drawImage(avatar2, 900, 150, 300, 300);

  const finalBuffer = canvas.toBuffer();
  fs.writeFileSync(imgBG, finalBuffer);

  // Remove avatars
  fs.removeSync(img1);
  fs.removeSync(img2);

  return api.sendMessage({
    body: `${header}\n━━━━━━━━━━━━━━\n💑 ${name1} ❤️ ${name2}\n${shayari}\n❤️ Compatibility: ${rating}\n━━━━━━━━━━━━━━\n🔱 𝗢𝗪𝗡𝗘𝗥 👑➪🦋⃟⃟ ⍣⃝ 𝗙𝗔𝗜𝗭𝗔𝗡➺༆𓆪⃟⍨⃝`,
    mentions: [{ tag: name2, id: id2 }],
    attachment: fs.createReadStream(imgBG)
  }, event.threadID, () => fs.unlinkSync(imgBG), event.messageID);
};
