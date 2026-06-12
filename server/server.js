require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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

// Helper: Read wishes from file
const getWishes = () => {
  if (!fs.existsSync(DB_FILE)) {
    // Seed database if file doesn't exist
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

// Helper: Send telegram notification
const sendTelegramNotification = async (sender, message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token === 'your_bot_token_here' || chatId === 'your_chat_id_here') {
    console.log('Telegram Bot Token or Chat ID not configured. Skipping notification.');
    return;
  }

  const text = `🎂 *New Wish for EM RAKSA!* 🎂\n\n👤 *From:* ${sender}\n💬 *Message:* "${message}"\n\n✨ Sent from Live Wish Board ✨`;
  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
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

// Endpoints

// GET: Fetch all wishes
app.get('/api/wishes', (req, res) => {
  const wishes = getWishes();
  res.json(wishes);
});

// POST: Add new wish
app.post('/api/wishes', (req, res) => {
  const { sender, message } = req.body;

  if (!sender || !sender.trim() || !message || !message.trim()) {
    return res.status(400).json({ error: 'Sender name and message are required.' });
  }

  const wishes = getWishes();
  const newWish = {
    id: `w-${Date.now()}`,
    sender: sender.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    avatarSeed: Math.floor(Math.random() * 100)
  };

  wishes.unshift(newWish); // Add new wish to the top
  const success = saveWishes(wishes);

  if (!success) {
    return res.status(500).json({ error: 'Failed to write to database file.' });
  }

  // Send telegram notification in background
  sendTelegramNotification(newWish.sender, newWish.message);

  // Commit updated wishes to GitHub repository in background
  commitToGitHub(wishes);

  res.status(201).json(newWish);
});

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
    
    // 1. Get the current file SHA (required for updating)
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

    // 2. Commit the updated content (using [skip ci] to prevent Render redeployment loops)
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

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🎉 Birthday API Server is running on port ${PORT}`);
  console.log(`👉 Live Wishes Board API: http://localhost:${PORT}/api/wishes`);
  console.log(`========================================`);
});
