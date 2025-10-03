const axios = require("axios");

module.exports.config = {
  name: "namaztime",
  version: "2.0",
  hasPermssion: 0,
  credits: "Cyber Chat BOT",
  description: "Namaz Azan Reminder",
  commandCategory: "reminder",
  countDown: 3,
};

module.exports.run = async ({ api }) => {
  const times = {
    "05:35 AM": {
      message: "✨Fajr Azan✨ Chalo sab namaz ke liye!",
      url: "https://download.quranicaudio.com/adhan/fajr.mp3"
    },
    "01:00 PM": {
      message: "✨Zohar Azan✨ Azan ho gayi hai!",
      url: "https://download.quranicaudio.com/adhan/zuhr.mp3"
    },
    "05:30 PM": {
      message: "✨Asr Azan✨ Chalo sab namaz ke liye!",
      url: "https://download.quranicaudio.com/adhan/asr.mp3"
    },
    "07:05 PM": {
      message: "✨Maghrib Azan✨ Ab maghrib ka waqt ho gaya hai!",
      url: "https://download.quranicaudio.com/adhan/maghrib.mp3"
    },
    "08:15 PM": {
      message: "✨Isha Azan✨ Chalo sab namaz ke liye!",
      url: "https://download.quranicaudio.com/adhan/isha.mp3"
    }
  };

  const checkTime = async () => {
    let now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).trim();

    if (times[now]) {
      try {
        let msg = {
          body: times[now].message,
          attachment: (await axios.get(times[now].url, { responseType: "stream" })).data
        };
        global.data.allThreadID.forEach(tid => api.sendMessage(msg, tid));
      } catch (e) {
        console.error("Attachment fetch error:", e.message);
        global.data.allThreadID.forEach(tid =>
          api.sendMessage(times[now].message, tid)
        );
      }
    }

    setTimeout(checkTime, 60000); // har 1 minute check karega
  };

  checkTime();
};
