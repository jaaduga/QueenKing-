const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "namaz",
  version: "4.0.0",
  hasPermission: 0,
  credits: "Cyber Chat Bot + GPT-5 Upgrade",
  description: "Namaz reminder with full automation & azan sounds",
  commandCategory: "Islamic",
  usages: "namaz [city]",
  cooldowns: 5,
};

let userCity = {};
let reminders = {};
let azanAudios = [
  "https://cdn.islamic.network/adhan/audio/128/ar/1.mp3",
  "https://cdn.islamic.network/adhan/audio/128/ar/2.mp3",
  "https://cdn.islamic.network/adhan/audio/128/ar/3.mp3",
  "https://cdn.islamic.network/adhan/audio/128/ar/4.mp3"
];

async function getTimings(city) {
  const res = await axios.get(
    `http://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(city)}`
  );
  return res.data.data;
}

function formatTimings(t) {
  return `
╭•┄┅══❁🌺❁══┅┄•╮
•—»✨𝙵𝙰𝙹𝚁: ${t.Fajr}
•—»✨𝙳𝙷𝚄𝙷𝚁: ${t.Dhuhr}
•—»✨𝙰𝚂𝙰𝚁: ${t.Asr}
•—»✨𝙼𝙰𝙶𝚁𝙸𝙱: ${t.Maghrib}
•—»✨𝙸𝚂𝙷𝙰: ${t.Isha}
•—»☀️𝚂𝚄𝙽𝚁𝙸𝚂𝙴: ${t.Sunrise}
•—»🌇𝚂𝚄𝙽𝚂𝙴𝚃: ${t.Sunset}
⋆✦⋆⎯⎯⎯⎯⋆✦⋆
📅 आज की नमाज़ टाइमिंग्स
╰•┄┅══❁🌺❁══┅┄•╯`;
}

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!args[0]) {
      return api.sendMessage(
        "junagadh—Mumbai:\nnamaz Delhi",
        event.threadID,
        event.messageID
      );
    }

    const city = args.join(" ");
    userCity[event.threadID] = city;

    const data = await getTimings(city);
    const t = data.timings;
    const date = data.date.gregorian;
    const hijri = data.date.hijri;

    const msg = `${formatTimings(t)}\n\n📆 ${date.day} ${date.month.en} ${date.year}\n🕋 ${hijri.day} ${hijri.month.en} ${hijri.year}`;

    const img = (
      await axios.get("https://i.imgur.com/gZuqamL.jpg", { responseType: "stream" })
    ).data;

    api.sendMessage({ body: msg, attachment: img }, event.threadID);

    // Reminder सेट करें अगर पहले नहीं किया गया
    if (!reminders[event.threadID]) {
      reminders[event.threadID] = true;

      // 🔄 हर दिन सुबह 5 बजे आज के टाइम्स भेजे
      setInterval(async () => {
        const loc = userCity[event.threadID];
        if (!loc) return;
        const data = await getTimings(loc);
        const t = data.timings;
        const msg = `🌅 *${loc}* में आज की नमाज़ टाइमिंग्स:\n${formatTimings(t)}`;
        api.sendMessage(msg, event.threadID);
      }, 24 * 60 * 60 * 1000); // हर 24 घंटे बाद

      // ⏰ हर मिनट नमाज़ टाइम चेक करे
      setInterval(async () => {
        const loc = userCity[event.threadID];
        if (!loc) return;
        const data = await getTimings(loc);
        const t = data.timings;
        const now = new Date();
        const current = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

        const prayers = {
          Fajr: t.Fajr,
          Dhuhr: t.Dhuhr,
          Asr: t.Asr,
          Maghrib: t.Maghrib,
          Isha: t.Isha,
        };

        for (const [name, time] of Object.entries(prayers)) {
          if (current === time.slice(0, 5)) {
            const azanUrl = azanAudios[Math.floor(Math.random() * azanAudios.length)];
            const audioPath = path.join(__dirname, `azan_${name}.mp3`);
            const writer = fs.createWriteStream(audioPath);
            const res = await axios({ url: azanUrl, method: "GET", responseType: "stream" });
            res.data.pipe(writer);
            writer.on("finish", () => {
              api.sendMessage(
                {
                  body: `🕌 ${name} की नमाज़ का वक़्त हो गया है!\nअल्लाहु अकबर 🤲`,
                  attachment: fs.createReadStream(audioPath),
                },
                event.threadID
              );
            });
          }
        }
      }, 60000);
    }
  } catch (err) {
    console.log(err);
    api.sendMessage(
      "⚠️ माफ करें, शहर का डेटा नहीं मिला। सही नाम लिखें।",
      event.threadID,
      event.messageID
    );
  }
};
