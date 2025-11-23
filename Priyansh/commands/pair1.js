module.exports.config = {
  name: "pair",
  version: "1.0.0",
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

  const path = __dirname + `/cache`;
  const id1 = event.senderID;
  const name1 = await Users.getNameUser(id1);
  const threadInfo = await api.getThreadInfo(event.threadID);
  const all = threadInfo.userInfo;
  const botID = api.getCurrentUserID();
  const gender1 = all.find(u => u.id == id1)?.gender || "UNKNOWN";

  let candidates = [];
  for (const u of all) {
    if (u.id !== id1 && u.id !== botID) {
      if (gender1 === "MALE" && u.gender === "FEMALE") candidates.push(u.id);
      else if (gender1 === "FEMALE" && u.gender === "MALE") candidates.push(u.id);
      else if (gender1 === "UNKNOWN") candidates.push(u.id);
    }
  }

  if (candidates.length === 0) return api.sendMessage("❌ Koi jodi nahi mili bhai 😔", event.threadID);

  const id2 = candidates[Math.floor(Math.random() * candidates.length)];
  const name2 = await Users.getNameUser(id2);

  // 💫 raj xwd elements
  const backgrounds = [
    "https://i.postimg.cc/wjJ29HRB/background1.png",
    "https://i.postimg.cc/zf4Pnshv/background2.png",
    "https://i.postimg.cc/5tXRQ46D/background3.png"
  ];
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
  const ratings = ["💘 100%", "💫 99.9%", "🔥 98%", "❤️ 101%", "🌟 97.5%", "👑 96.69%", "🕊️ 100.0%"];

  const header = "✨ Ye jodi likhi hai god ne ✨\n💢 Kalm tha... FARAZ KHAN 👑";
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const shayari = shayaris[Math.floor(Math.random() * shayaris.length)];
  const rating = ratings[Math.floor(Math.random() * ratings.length)];

  const pathImg = `${path}/pairbg.png`;
  const pathAvt1 = `${path}/avt1.png`;
  const pathAvt2 = `${path}/avt2.png`;

  // 📥 Get profile pics and background
  const avt1 = (await axios.get(`https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathAvt1, Buffer.from(avt1, "utf-8"));

  const avt2 = (await axios.get(`https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathAvt2, Buffer.from(avt2, "utf-8"));

  const bgImage = (await axios.get(bg, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(bgImage, "utf-8"));

  // 🖼️ Create final image
  const baseImg = await loadImage(pathImg);
  const avatar1 = await loadImage(pathAvt1);
  const avatar2 = await loadImage(pathAvt2);
  const canvas = createCanvas(baseImg.width, baseImg.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(avatar1, 100, 150, 300, 300); // position 1
  ctx.drawImage(avatar2, 900, 150, 300, 300); // position 2

  const finalBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, finalBuffer);

  // 🧹 Cleanup
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  // 📨 Send message
  return api.sendMessage({
    body: `${header}\n━━━━━━━━━━━━━━\n💑 ${name1} ❤️ ${name2}\n${shayari}\n❤️ Compatibility: ${rating}\n━━━━━━━━━━━━━━\n🔱 Powered by FARAZ `,
    mentions: [{ tag: name2, id: id2 }],
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
