/**
 * LinguaShift — Language Translation Tool
 * Powered by Claude AI (claude-sonnet-4-20250514)
 *
 * ⚠️  SETUP REQUIRED:
 *      Replace "YOUR_ANTHROPIC_API_KEY_HERE" below with your actual key.
 *      Get one free at: https://console.anthropic.com/
 *
 * ℹ️  IMPORTANT:
 *      For local use / demos this is fine.
 *      For a public website, move the API call to a backend server
 *      so your key is never exposed in the browser.
 */

const ANTHROPIC_API_KEY = "AIzaSyDN9bKd1EzmTYd-VExV7v2LfpkBe4tUeRo";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const API_URL = "https://api.anthropic.com/v1/messages";

/* ── DOM references ────────────────────────────────────────────────────── */
const sourceText = document.getElementById("source-text");
const targetText = document.getElementById("target-text");
const sourceLang = document.getElementById("source-lang");
const targetLang = document.getElementById("target-lang");
const translateBtn = document.getElementById("translate-btn");
const btnText = document.getElementById("btn-text");
const spinner = document.getElementById("spinner");
const copyBtn = document.getElementById("copy-btn");
const speakSrcBtn = document.getElementById("speak-source-btn");
const speakTgtBtn = document.getElementById("speak-target-btn");
const clearBtn = document.getElementById("clear-btn");
const charCount = document.getElementById("char-count");
const statusEl = document.getElementById("status");
const detectLabel = document.getElementById("detecting-label");

/* ── Character counter ─────────────────────────────────────────────────── */
sourceText.addEventListener("input", () => {
  charCount.textContent = `${sourceText.value.length} / 2000`;
});

/* ── Keyboard shortcut: Ctrl+Enter ────────────────────────────────────── */
sourceText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    translateBtn.click();
  }
});

/* ── Swap languages (+ swap text) ──────────────────────────────────────── */
document.getElementById("swap-btn").addEventListener("click", () => {
  const srcVal = sourceLang.value === "auto" ? "English" : sourceLang.value;
  const tgtVal = targetLang.value;

  // Swap textarea content
  const tmp = sourceText.value;
  sourceText.value = targetText.value;
  targetText.value = tmp;
  charCount.textContent = `${sourceText.value.length} / 2000`;

  // Swap selects
  setSelectValue(sourceLang, tgtVal);
  setSelectValue(targetLang, srcVal);
  detectLabel.textContent = "";
});

function setSelectValue(selectEl, val) {
  for (const opt of selectEl.options) {
    if (opt.value === val) { opt.selected = true; return; }
  }
}

/* ── Status helper ─────────────────────────────────────────────────────── */
let statusTimer = null;

function showStatus(msg, type) {
  clearTimeout(statusTimer);
  statusEl.textContent = msg;
  statusEl.className = `status ${type}`;
  if (type === "success") {
    statusTimer = setTimeout(() => { statusEl.className = "status"; }, 3500);
  }
}

/* ── Set loading state ─────────────────────────────────────────────────── */
function setLoading(on) {
  translateBtn.disabled = on;
  spinner.classList.toggle("active", on);
  btnText.textContent = on ? "Translating…" : "✦ Translate";
}

/* ── Main translate function ───────────────────────────────────────────── */
translateBtn.addEventListener("click", async () => {
  const text = sourceText.value.trim();
  if (!text) {
    showStatus("⚠  Please enter some text to translate.", "error");
    return;
  }

  if (ANTHROPIC_API_KEY === "YOUR_ANTHROPIC_API_KEY_HERE") {
    showStatus("⚠  API key not set. Open js/app.js and replace YOUR_ANTHROPIC_API_KEY_HERE.", "error");
    return;
  }

  const src = sourceLang.value === "auto"
    ? "the language of the provided text (auto-detect it)"
    : sourceLang.value;
  const tgt = targetLang.value;

  setLoading(true);
  statusEl.className = "status";
  targetText.value = "";
  detectLabel.textContent = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-calls": "true"
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a professional translator.
Task: Translate the text below from ${src} into ${tgt}.
Rules:
- Return ONLY the translated text, nothing else.
- No preamble, no explanation, no quotation marks around the result.
- Preserve the original formatting (line breaks, punctuation style).
${sourceLang.value === "auto" ? "- After the translation, on a new line write exactly: [Detected: <language name>]" : ""}

Text to translate:
${text}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    let translation = data?.content?.[0]?.text?.trim() ?? "";

    // Extract auto-detect label if present
    const detectedMatch = translation.match(/\[Detected:\s*(.+?)\]\s*$/i);
    if (detectedMatch) {
      detectLabel.textContent = `Detected: ${detectedMatch[1]}`;
      translation = translation.replace(detectedMatch[0], "").trim();
    }

    if (!translation) throw new Error("Empty response from API.");

    targetText.value = translation;
    showStatus("✓ Translation complete!", "success");

  } catch (err) {
    showStatus(`✕ Error: ${err.message}`, "error");
    console.error("[LinguaShift]", err);
  } finally {
    setLoading(false);
  }
});

/* ── Copy translation ──────────────────────────────────────────────────── */
copyBtn.addEventListener("click", async () => {
  const text = targetText.value.trim();
  if (!text) {
    showStatus("⚠  Nothing to copy yet.", "error");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.classList.add("success");
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => {
      copyBtn.classList.remove("success");
      copyBtn.textContent = "📋 Copy Translation";
    }, 2200);
  } catch {
    /* Fallback for browsers that block clipboard */
    targetText.select();
    document.execCommand("copy");
    showStatus("✓ Copied (fallback method).", "success");
  }
});

/* ── Text-to-speech ────────────────────────────────────────────────────── */
function speak(text, langName) {
  if (!text) { showStatus("⚠  No text to speak.", "error"); return; }
  if (!("speechSynthesis" in window)) {
    showStatus("⚠  Text-to-speech is not supported in this browser.", "error");
    return;
  }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);

  /* Map language name → BCP-47 code for better TTS quality */
  const langMap = {
    English: "en-US", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
    Italian: "it-IT", Portuguese: "pt-PT", Russian: "ru-RU", Japanese: "ja-JP",
    Chinese: "zh-CN", Korean: "ko-KR", Arabic: "ar-SA", Hindi: "hi-IN",
    Bengali: "bn-IN", Marathi: "mr-IN", Telugu: "te-IN", Tamil: "ta-IN",
    Urdu: "ur-PK", Dutch: "nl-NL", Polish: "pl-PL", Swedish: "sv-SE",
    Norwegian: "nb-NO", Danish: "da-DK", Finnish: "fi-FI", Greek: "el-GR",
    Turkish: "tr-TR", Hebrew: "he-IL", Thai: "th-TH", Vietnamese: "vi-VN",
    Indonesian: "id-ID", Malay: "ms-MY", Swahili: "sw-KE", Ukrainian: "uk-UA",
    Czech: "cs-CZ", Hungarian: "hu-HU", Romanian: "ro-RO"
  };

  utt.lang = langMap[langName] ?? "en-US";
  utt.rate = 0.93;
  window.speechSynthesis.speak(utt);
}

speakSrcBtn.addEventListener("click", () =>
  speak(sourceText.value.trim(),
    sourceLang.value === "auto" ? "English" : sourceLang.value));

speakTgtBtn.addEventListener("click", () =>
  speak(targetText.value.trim(), targetLang.value));

/* ── Clear all ─────────────────────────────────────────────────────────── */
clearBtn.addEventListener("click", () => {
  sourceText.value = "";
  targetText.value = "";
  charCount.textContent = "0 / 2000";
  detectLabel.textContent = "";
  statusEl.className = "status";
  window.speechSynthesis?.cancel();
});
