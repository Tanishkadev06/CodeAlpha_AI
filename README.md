 HEAD
<h2> FAQ Chatbot using NLP </h2> <br>
I put this project together to solve a common problem: making a chatbot that actually understands what a person is asking without needing a massive, complex AI model. This was built as part of my Task 2 (referencing image_b21262.png) using Antigravity IDE.

How it works
The core of this bot is about Retrieval. Instead of the bot "hallucinating" or guessing an answer, it looks at a specific set of FAQs I provided in a data.json file.

I didn't want the bot to fail just because someone used different wording, so I used TF-IDF and Cosine Similarity. Basically, the code turns the user's question into math (a vector) and compares it to my stored questions. Even if the wording isn't a 100% match, the bot finds the "closest" possible answer. If the question is completely irrelevant, I set a threshold so it just tells the user it doesn't know the answer yet.

What’s under the hood?
Python: The main logic.

Scikit-Learn: Handles the heavy lifting for the TF-IDF math and similarity scores.

JSON: I used this for the data because it's super easy to add or change questions without touching the actual code.

NLTK: For cleaning up the text so the bot focuses on the words that actually matter.

Setting it up
If you're trying to run this on your own machine:

Make sure you've got Python set up in your system path (I had to fix this on my PC to get it running!).

Install the libraries: pip install scikit-learn nltk

Just run python main.py and start chatting. You can type quit whenever you're done.

Feedbacks are welcome!

# LinguaShift — Language Translation Tool

AI-powered language translator built with vanilla HTML, CSS, and JavaScript.
Uses the Claude AI API (claude-sonnet-4-20250514) for translations.

---

## 📁 Project Structure

```
lingua-shift/
├── index.html        ← Main page
├── css/
│   └── style.css     ← All styles
├── js/
│   └── app.js        ← All logic + API call
└── README.md         ← This file
```

---

## 🚀 Setup (3 steps)

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com/
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Add your API key
Open `js/app.js` in any text editor and replace line 12:

```js
// BEFORE:
const ANTHROPIC_API_KEY = "YOUR_ANTHROPIC_API_KEY_HERE";

// AFTER (example):
const ANTHROPIC_API_KEY = "sk-ant-api03-xxxxxxxxxxxxxxxx";
```

### Step 3 — Open in browser
Just double-click `index.html` — no server needed!

---

## ✨ Features

| Feature | Details |
|---|---|
| 35+ Languages | Including Hindi, Marathi, Tamil, Telugu, Urdu & more |
| Auto-detect | Detects source language automatically |
| Swap | Swaps languages and text with one click |
| Copy | Copies translation to clipboard |
| Text-to-Speech | Speaks source or translated text aloud |
| Keyboard shortcut | Ctrl+Enter to translate |
| Clear | Clears all fields at once |

---

## ⚠️ Security Note

Your API key is in the JavaScript file, which is visible in the browser.
This is **fine for personal / local use**.

For a **public website**, move the API call to a backend (Node.js, Python, etc.)
so the key is never exposed to users.

---

## 💡 Troubleshooting

| Problem | Fix |
|---|---|
| "API key not set" | Set your key in `js/app.js` (Step 2 above) |
| Blank translation | Check browser console (F12) for errors |
| CORS error | Use a local server: `npx serve .` or Python's `python -m http.server` |
| TTS not working | Use Chrome or Edge; Safari has limited TTS support |

---

## 🛠 Running with a local server (optional)

If you hit CORS issues opening the file directly, run a tiny local server:

```bash
# Option A — Node.js
npx serve .

# Option B — Python 3
python -m http.server 8080

# Then open: http://localhost:8080
```
 0377472 (Initial commit - LinguaShift translation app)
