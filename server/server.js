require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'wishes.json');

// Middleware
app.use(cors());
app.use(express.json());

// Default Wishes Seed Data
const DEFAULT_WISHES = [
  {
    id: 'w-1',
    sender: 'Muny Rachna',
    message: 'Happy Early Birthday, EM RAKSA! May this special milestone bring you endless joy, peace, and success in everything you do. Stay awesome and keep inspiring us! ✨🎂',
    timestamp: new Date('2026-06-11T12:00:00Z').toISOString(),
    avatarSeed: 12
  },
  {
    id: 'w-2',
    sender: 'Ou Seavinh',
    message: 'Wishing you an absolute blast on your upcoming birthday, bro! Let the countdown begin! Stay healthy, wealthy, and keep coding amazing things! 🚀💻',
    timestamp: new Date('2026-06-11T14:30:00Z').toISOString(),
    avatarSeed: 42
  },
  {
    id: 'w-3',
    sender: 'Em Chetra',
    message: 'Happy Birthday, EM RAKSA! Sending you warm wishes and positive vibes from afar. May all your dreams and aspirations come true in 2026! 🥳🎈🌟',
    timestamp: new Date('2026-06-11T16:45:00Z').toISOString(),
    avatarSeed: 88
  }
];

// Connect to MongoDB with Fallback Support
const DATABASE_URL = process.env.DATABASE_URL;
let isMongoConnected = false;

// Mongoose Wish Schema & Model
const wishSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  avatarSeed: { type: Number, required: true }
});

wishSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

const Wish = mongoose.model('Wish', wishSchema);

// Seed database with defaults if empty
const seedDefaultWishesIfNeeded = async () => {
  try {
    const count = await Wish.countDocuments();
    if (count === 0) {
      const mappedWishes = DEFAULT_WISHES.map(w => {
        const copy = { ...w };
        delete copy.id;
        return copy;
      });
      await Wish.insertMany(mappedWishes);
      console.log('🌱 Seeded default wishes into MongoDB.');
    }
  } catch (err) {
    console.error('Error seeding default wishes:', err);
  }
};

if (DATABASE_URL) {
  mongoose.connect(DATABASE_URL)
    .then(() => {
      console.log('✅ Connected to MongoDB successfully.');
      isMongoConnected = true;
      seedDefaultWishesIfNeeded();
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
    });
} else {
  console.log('⚠️ DATABASE_URL not set in environment. Running with local wishes.json fallback.');
}

// Helper: Read wishes from file
const getWishes = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_WISHES, null, 2));
    return DEFAULT_WISHES;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return DEFAULT_WISHES;
  }
};

// Helper: Save wishes to file
const saveWishes = (wishes) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(wishes, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
};

// Helper: Escape HTML characters for Telegram HTML parse mode
const escapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

// Helper: Send telegram notification
const sendTelegramNotification = async (sender, message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token === 'your_bot_token_here' || chatId === 'your_chat_id_here') {
    console.log('Telegram Bot Token or Chat ID not configured. Skipping notification.');
    return;
  }

  const escapedSender = escapeHtml(sender);
  const escapedMessage = escapeHtml(message);
  const text = `🎂 <b>New Wish for EM RAKSA!</b> 🎂\n\n👤 <b>From:</b> ${escapedSender}\n💬 <b>Message:</b> "${escapedMessage}"\n\n✨ Sent from Live Wish Board ✨`;
  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram notification failed:', errorData);
    } else {
      console.log('Telegram notification sent successfully to:', chatId);
    }
  } catch (err) {
    console.error('Error triggering Telegram webhook:', err);
  }
};

// Helper: Commit wishes.json to GitHub repository to persist database
const commitToGitHub = async (wishes) => {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'raksa99';
  const repo = 'My-Birthday_EmRaksa';
  const path = 'server/wishes.json';

  if (!token || token === 'your_github_token_here') {
    console.log('GITHUB_TOKEN not configured. Skipping GitHub commit.');
    return;
  }

  try {
    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    let sha = null;
    const getRes = await fetch(fileUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Node-Fetch'
      }
    });

    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    } else if (getRes.status !== 404) {
      console.error('Error fetching file SHA from GitHub:', await getRes.text());
      return;
    }

    const contentBase64 = Buffer.from(JSON.stringify(wishes, null, 2)).toString('base64');
    const putRes = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Node-Fetch'
      },
      body: JSON.stringify({
        message: 'db: update wishes.json [skip ci]',
        content: contentBase64,
        sha: sha || undefined
      })
    });

    if (!putRes.ok) {
      console.error('Failed to commit wishes.json to GitHub:', await putRes.text());
    } else {
      console.log('Successfully committed wishes.json to GitHub repository.');
    }
  } catch (err) {
    console.error('Error committing wishes.json to GitHub:', err);
  }
};

// Endpoints

// GET: Fetch all wishes
app.get('/api/wishes', async (req, res) => {
  if (isMongoConnected) {
    try {
      const wishes = await Wish.find().sort({ timestamp: -1 });
      return res.json(wishes);
    } catch (err) {
      console.error('Failed to fetch from MongoDB, falling back to local file:', err);
    }
  }
  const wishes = getWishes();
  res.json(wishes);
});

// POST: Add new wish
app.post('/api/wishes', async (req, res) => {
  const { sender, message } = req.body;

  if (!sender || !sender.trim() || !message || !message.trim()) {
    return res.status(400).json({ error: 'Sender name and message are required.' });
  }

  const senderClean = sender.trim();
  const messageClean = message.trim();
  const timestamp = new Date().toISOString();
  const avatarSeed = Math.floor(Math.random() * 100);

  let newWish = null;

  if (isMongoConnected) {
    try {
      const wishDoc = new Wish({
        sender: senderClean,
        message: messageClean,
        timestamp,
        avatarSeed
      });
      await wishDoc.save();
      newWish = wishDoc.toJSON();
      
      const wishes = await Wish.find().sort({ timestamp: -1 });
      saveWishes(wishes);
    } catch (err) {
      console.error('Failed to save to MongoDB:', err);
    }
  }

  if (!newWish) {
    const wishes = getWishes();
    newWish = {
      id: `w-${Date.now()}`,
      sender: senderClean,
      message: messageClean,
      timestamp,
      avatarSeed
    };
    wishes.unshift(newWish);
    saveWishes(wishes);
  }

  // Send telegram notification in background
  sendTelegramNotification(newWish.sender, newWish.message);

  // Commit updated wishes to GitHub
  try {
    const allWishes = isMongoConnected 
      ? await Wish.find().sort({ timestamp: -1 })
      : getWishes();
    commitToGitHub(allWishes);
  } catch (err) {
    console.error('Error fetching wishes for GitHub commit:', err);
  }

  res.status(201).json(newWish);
});

// DELETE: Remove a wish by ID
app.delete('/api/wishes/:id', async (req, res) => {
  const { id } = req.params;
  let deletedWish = null;

  if (isMongoConnected) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        deletedWish = await Wish.findByIdAndDelete(id);
      } else {
        deletedWish = await Wish.findOneAndDelete({ _id: id });
        if (!deletedWish) {
          deletedWish = await Wish.findOneAndDelete({ id: id });
        }
      }
      
      if (deletedWish) {
        const wishes = await Wish.find().sort({ timestamp: -1 });
        saveWishes(wishes);
      }
    } catch (err) {
      console.error('Failed to delete from MongoDB:', err);
    }
  }

  if (!deletedWish) {
    let wishes = getWishes();
    const wishIndex = wishes.findIndex(w => w.id === id);
    if (wishIndex !== -1) {
      deletedWish = wishes.splice(wishIndex, 1)[0];
      saveWishes(wishes);
    }
  }

  if (!deletedWish) {
    return res.status(404).json({ error: 'Wish not found.' });
  }

  // Sync to GitHub
  try {
    const allWishes = isMongoConnected 
      ? await Wish.find().sort({ timestamp: -1 })
      : getWishes();
    commitToGitHub(allWishes);
  } catch (err) {
    console.error('Error fetching wishes for GitHub commit:', err);
  }

  res.json({ message: 'Wish deleted successfully.', wish: deletedWish });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🎉 Birthday API Server is running on port ${PORT}`);
  console.log(`👉 Live Wishes Board API: http://localhost:${PORT}/api/wishes`);
  console.log(`========================================`);
});
