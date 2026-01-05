const schedule = require("node-schedule");
const moment = require("moment-timezone");
const chalk = require("chalk");

module.exports.config = {
    name: "autosent",
    version: "12.0.0",
    hasPermssion: 0,
    credits: "ARIF BABU",
    description: "Auto Time Message With Date & Time",
    commandCategory: "group messenger",
    usages: "[]",
    cooldowns: 3
};

// 🕒 FULL DAY AUTO MESSAGES
const messages = [
    { time: "12:30 AM", text: "🌙•✧ So jao baby good night 🥀 ✧•🌙" },
    { time: "1:30 AM", text: "😴•✧ Ab bhi jaag rahe ho 😐 ✧•😴" },
    { time: "2:30 AM", text: "🌌•✧ Neend aa jaye 🌃 ✧•🌌" },
    { time: "3:30 AM", text: "🌃•✧ Phone band karo ab ✧•🌃" },
    { time: "4:30 AM", text: "😪•✧ Sona zaruri hai ✧•😪" },
    { time: "5:30 AM", text: "🐔•✧ Jaldi uthne wale log ✧•🐔" },
    { time: "6:30 AM", text: "🌄•✧ Assalamu Alaikum ❤️ ✧•🌄" },
    { time: "7:30 AM", text: "☀️•✧ Good Morning Baby ✧•☀️" },
    { time: "8:30 AM", text: "😵•✧ Uth gaye President ji? ✧•😵" },
    { time: "9:30 AM", text: "🍳•✧ Breakfast kar lo ✧•🍳" },
    { time: "10:30 AM", text: "🏫•✧ College ya kaam ka time ✧•🏫" },
    { time: "11:30 AM", text: "😻•✧ Mujhe bhi yaad kar liya karo ✧•😻" },
    { time: "12:30 PM", text: "🌞•✧ Good Afternoon Everyone ✧•🌞" },
    { time: "1:30 PM", text: "🍽️•✧ Lunch kar lo baby ✧•🍽️" },
    { time: "2:30 PM", text: "🙏•✧ Jai Shree Ram ✧•🙏" },
    { time: "3:30 PM", text: "🥀•✧ Thoda aaram kar lo ✧•🥀" },
    { time: "4:30 PM", text: "🥵•✧ Bahut garmi hai aaj ✧•🥵" },
    { time: "5:30 PM", text: "😊•✧ Hamesha khush raho ✧•😊" },
    { time: "6:30 PM", text: "🚩•✧ Sanatan Dharma Zindabad ✧•🚩" },
    { time: "7:30 PM", text: "💞•✧ Khush rehna mera promise ✧•💞" },
    { time: "8:30 PM", text: "🍛•✧ Dinner karna mat bhoolo ✧•🍛" },
    { time: "9:30 PM", text: "💖•✧ Mere cute baby ✧•💖" },
    { time: "10:30 PM", text: "☺️•✧ Hamesha muskurate raho ✧•☺️" },
    { time: "11:30 PM", text: "🌙•✧ Khana khaya aapne? ✧•🌙" }
];

// 🧠 MESSAGE FORMAT
function buildMessage(time, text) {
    const now = moment().tz("Asia/Kolkata");

    return `
✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦
😊  𝙏𝙄𝙈𝙀  ✅
✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦

🕐 TIME: ${time}
📅 DATE: ${now.format("DD MMMM YYYY").toUpperCase()}

${text}

━━━━━━━━━━━━━━━
MADE BY ❤️‍🔥 FARAZ KHAN`;
}

module.exports.onLoad = ({ api }) => {
    console.log(
        chalk.bold.hex("#00c300")(
            "=========== AUTOSENT TIME MESSAGE LOADED ==========="
        )
    );

    messages.forEach(({ time, text }) => {
        const [hour, minute, period] = time.split(/[: ]/);
        let hour24 = parseInt(hour);

        if (period === "PM" && hour !== "12") hour24 += 12;
        if (period === "AM" && hour === "12") hour24 = 0;

        schedule.scheduleJob(
            { hour: hour24, minute: parseInt(minute), tz: "Asia/Kolkata" },
            () => {
                const msg = buildMessage(time, text);

                global.data.allThreadID.forEach(threadID => {
                    api.sendMessage(msg, threadID);
                });
            }
        );
    });
};

module.exports.run = () => {};
