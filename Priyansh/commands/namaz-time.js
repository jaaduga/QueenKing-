const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "auto_azan",
  version: "11.0.0",
  hasPermission: 0,
  credits: "Cyber Chat Bot + GPT-5 Junagadh Auto Fix",
  description: "Auto Azan Reminder for Junagadh (No Prefix) with Time Display",
  commandCategory: "Islamic",
  usages: "Auto run (no prefix)",
  cooldowns: 5,
};

const cacheFile = path.join(__dirname, "namazCache.json");
let loopStarted = false;

// ================= MAIN AUTO LOOP =================
module.exports.handleEvent = async ({ api }) => {
  if (loopStarted) return;
  loopStarted = true;

  console.log("🕌 Auto Azan Reminder (Junagadh) चालू हो गया ✅");

  setInterval(async () => {
    try {
      const city = "Junagadh";
      const timings = await getNamazTimes(city);
      if (!timings) return;

      const now = new Date();
      const currentTime = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      const list = [
        { time: timings.Fajr, msg: "🌅 *फ़ज्र* का वक़्त शुरू हो गया है। नमाज़ पढ़ लो भाई 🕌" },
        { time: timings.Dhuhr, msg: "🌞 *ज़ुहर* का वक़्त शुरू हो गया है। नमाज़ का समय है 🕌" },
        { time: timings.Asr, msg: "🌇 *असर* का वक़्त शुरू हो गया है। नमाज़ पढ़ लो 🕌" },
        { time: timings.Maghrib, msg: "🌆 *मग़रिब* का वक़्त शुरू हो गया है। नमाज़ का वक्त है 🕌" },
        { time: timings.Isha, msg: "🌙 *ईशा* का वक़्त शुरू हो गया है। नमाज़ अदा कर लो 🕌" },
      ];

      for (const { time, msg } of list) {
        if (matchTime(time, currentTime)) {
          await sendAzanAllGroups(api, msg, city, time);
        }
      }
    } catch (err) {
      console.error("Loop Error:", err);
    }
  }, 60000);
};

// ================= HELPER FUNCTIONS =================

async function getNamazTimes(city) {
  try {
    if (fs.existsSync(cacheFile)) {
      const cache = JSON.parse(fs.readFileSync(cacheFile));
      const cached = cache[city.toLowerCase()];
      if (cached && Date.now() - cached.timestamp < 3600000) {
        return cached.data.data.timings;
      }
    }

    const res = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=India`
    );
    const timings = res.data.data.timings;

    let cache = {};
    if (fs.existsSync(cacheFile)) cache = JSON.parse(fs.readFileSync(cacheFile));
    cache[city.toLowerCase()] = { data: res.data, timestamp: Date.now() };
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));

    return timings;
  } catch {
    return null;
  }
}

function matchTime(apiTime, nowTime) {
  return apiTime.slice(0, 5) === nowTime.slice(0, 5);
}

async function sendAzanAllGroups(api, message, city, azanTime) {
  const azanUrl = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";
  const audioPath = path.join(__dirname, "azan.mp3");

  try {
    const response = await axios.get(azanUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(audioPath, Buffer.from(response.data));

    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    for (const thread of allThreads) {
      api.sendMessage(
        {
          body: `📣 *${city.toUpperCase()}* में अज़ान का वक़्त है 📣\n${message} (वक्त: ${azanTime})\n\n🕋 *अल्लाहु अकबर* 🕋`,
          attachment: fs.createReadStream(audioPath),
        },
        thread.threadID,
        () => fs.unlinkSync(audioPath)
      );
    }
  } catch (err) {
    console.error("Azan send error:", err);
  }
}
