import TelegramBot from "node-telegram-bot-api";

// Ganti dengan token yang Anda terima dari @BotFather
const token = "8029408217:AAHPwffoJQRXqjwfngXfVFonOdlqFPP_RIM";

const bot = new TelegramBot(token, { polling: true });

// Objek untuk menyimpan status percakapan berdasarkan chatId
const users = {};

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text ? msg.text.toLowerCase() : "";

  // Jika pengguna baru memulai percakapan
  if (userText === "/start") {
    bot.sendMessage(chatId, "Halo! Ada yang perlu saya bantu?");
  }

  // Jika pengguna mengetik "iya", bot akan meminta nama
  else if (userText === "iya" && !users[chatId]) {
    bot.sendMessage(chatId, "Okey, sebelum itu mari berkenalan! Siapa nama Anda?");
    
    // Set status pengguna untuk mulai menangkap nama mereka
    users[chatId] = { expectingName: true };
  }
  else if (userText === "siapa nama saya" && !users[chatId]) {
    bot.sendMessage(chatId, `hallo ${users}`);
    
    // Set status pengguna untuk mulai menangkap nama mereka
    users[chatId] = { expectingName: true };
  }

  // Jika bot sedang menunggu nama pengguna, simpan nama mereka
  else if (users[chatId] && users[chatId].expectingName && msg.text) {
    const username = msg.text;
    users[chatId].username = username;  // Simpan nama pengguna

    // Reset status expectingName
    users[chatId].expectingName = false;

    bot.sendMessage(chatId, `Halo, ${username}! Apa kabar?`);
  }

  // Menangani perintah "info" untuk menampilkan nama pengguna
  else if (userText === "info" && users[chatId] && users[chatId].username) {
    bot.sendMessage(chatId, `Halo ${users[chatId].username}, saya siap membantu Anda!`);
  }

  // Pesan default jika tidak sesuai
  else {
    bot.sendMessage(chatId, "Maaf, saya tidak mengerti pesan Anda.");
  }
});

// Menangani perintah /echo (bisa digunakan untuk mengulang pesan)
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // Teks yang dikirimkan setelah perintah "/echo"

  bot.sendMessage(chatId, resp);
});
