# LinguaShift — Language Translation Tool
### Powered by Google Gemini API (100% FREE)

---

## 📁 Project Structure

```
lingua-shift/
├── index.html       ← Open this in your browser
├── css/
│   └── style.css    ← All styles
├── js/
│   └── app.js       ← All logic + Gemini API call
└── README.md        ← This file
```

---

## 🚀 Setup — 3 Easy Steps

### Step 1 — Get your FREE Gemini API Key

1. Go to 👉 https://aistudio.google.com/app/apikey
2. Sign in with your **Google account** (Gmail)
3. Click **"Create API Key"**
4. Copy the key (looks like: `AIzaSy...`)

> ✅ No credit card. No billing. Completely free.

---

### Step 2 — Paste your key into the app

Open `js/app.js` in Notepad / VS Code and find line 13:

```js
// BEFORE:
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

// AFTER (example):
const GEMINI_API_KEY = "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
```

Save the file.

---

### Step 3 — Open in browser

Double-click **`index.html`** — it opens in your browser and works immediately!

> No Node.js, no npm, no server required.

---

## ✨ Features

| Feature | Details |
|---|---|
| 35+ Languages | Hindi, Marathi, Tamil, Telugu, Urdu + all major world languages |
| Auto-detect | Gemini detects source language automatically |
| Swap | Swaps both languages and text with one click |
| Copy Button | Copies translated text to clipboard |
| Text-to-Speech | Reads source or translated text aloud |
| Keyboard Shortcut | Ctrl+Enter to translate instantly |
| Clear All | Resets everything in one click |

---

## 📊 Gemini Free Tier Limits

| Limit | Amount |
|---|---|
| Requests per minute | 15 |
| Requests per day | 1,500 |
| Tokens per day | 1,000,000 |

More than enough for personal / student use!

---

## 💡 Troubleshooting

| Problem | Solution |
|---|---|
| "API key not set" error | Paste your key in `js/app.js` (Step 2) |
| `400 API_KEY_INVALID` | Double-check you copied the full key |
| Blank translation | Open browser console (F12) and check for errors |
| CORS error | Run a local server (see below) |
| TTS not working | Use Chrome or Edge browser |

---

## 🛠 Optional: Run with a local server

If you ever get a CORS error opening the file directly:

```bash
# Python (built-in, no install needed)
python -m http.server 8080
# Then open: http://localhost:8080

# OR with Node.js
npx serve .
# Then open: http://localhost:3000
```
