/**
 * LinguaShift — Language Translation Tool
 * Powered by Google Gemini API (FREE — gemini-1.5-flash)
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  SETUP (takes ~2 minutes, completely free):
 *  1. Go to https://aistudio.google.com/app/apikey
 *  2. Sign in with your Google account
 *  3. Click "Create API Key"
 *  4. Copy the key and paste it below
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const GEMINI_API_KEY = "AIzaSyDsPiv10vBfU3rmJT5CghqjLSKxv9iysq4";   // ← paste your key here
const GEMINI_MODEL   = "gemini-1.5-flash";
const API_URL        = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/* ── DOM references ──────────────────────────────────────────────────── */
const sourceText   = document.getElementById("source-text");
const targetText   = document.getElementById("target-text");
const sourceLang   = document.getElementById("source-lang");
const targetLang   = document.getElementById("target-lang");
const translateBtn = document.getElementById("translate-btn");
const btnText      = document.getElementById("btn-text");
const spinner      = document.getElementById("spinner");
const copyBtn      = document.getElementById("copy-btn");
const speakSrcBtn  = document.getElementById("speak-source-btn");
const speakTgtBtn  = document.getElementById("speak-target-btn");
const clearBtn     = document.getElementById("clear-btn");
const charCount    = document.getElementById("char-count");
const statusEl     = document.getElementById("status");
const detectLabel  = document.getElementById("detecting-label");

/* ── Character counter ───────────────────────────────────────────────── */
sourceText.addEventListener("input", () => {
  charCount.textContent = `${sourceText.value.length} / 2000`;
});

/* ── Ctrl+Enter shortcut ─────────────────────────────────────────────── */
sourceText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    translateBtn.click();
  }
});

/* ── Swap languages + text ───────────────────────────────────────────── */
document.getElementById("swap-btn").addEventListener("click", () => {
  const srcVal = sourceLang.value === "auto" ? "English" : sourceLang.value;
  const tgtVal = targetLang.value;

  const tmp        = sourceText.value;
  sourceText.value = targetText.value;
  targetText.value = tmp;
  charCount.textContent = `${sourceText.value.length} / 2000`;

  setSelectValue(sourceLang, tgtVal);
  setSelectValue(targetLang, srcVal);
  detectLabel.textContent = "";
});

function setSelectValue(sel, val) {
  for (const opt of sel.options) {
    if (opt.value === val) { opt.selected = true; return; }
  }
}

/* ── Status helper ───────────────────────────────────────────────────── */
let statusTimer = null;
function showStatus(msg, type) {
  clearTimeout(statusTimer);
  statusEl.textContent = msg;
  statusEl.className   = `status ${type}`;
  if (type === "success") {
    statusTimer = setTimeout(() => { statusEl.className = "status"; }, 3500);
  }
}

/* ── Loading state ───────────────────────────────────────────────────── */
function setLoading(on) {
  translateBtn.disabled = on;
  spinner.classList.toggle("active", on);
  btnText.textContent   = on ? "Translating…" : "✦ Translate";
}

/* ── Translate via Gemini ────────────────────────────────────────────── */
translateBtn.addEventListener("click", async () => {
  const text = sourceText.value.trim();

  if (!text) {
    showStatus("⚠  Please enter some text to translate.", "error");
    return;
  }

  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    showStatus("⚠  API key not set. Open js/app.js and replace YOUR_GEMINI_API_KEY_HERE.", "error");
    return;
  }

  const src = sourceLang.value === "auto"
    ? "the language of the provided text (auto-detect it)"
    : sourceLang.value;
  const tgt = targetLang.value;

  setLoading(true);
  statusEl.className      = "status";
  targetText.value        = "";
  detectLabel.textContent = "";

  const prompt = `You are a professional translator.
Task: Translate the text below from ${src} into ${tgt}.
Rules:
- Return ONLY the translated text, nothing else.
- No preamble, no explanation, no quotation marks around the result.
- Preserve original formatting (line breaks, punctuation style).
${sourceLang.value === "auto" ? "- After the translation, on a new line write exactly: [Detected: <language name>]" : ""}

Text to translate:
${text}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data        = await response.json();
    let   translation = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!translation) throw new Error("Empty response from Gemini.");

    // Extract auto-detect label if present
    const detectedMatch = translation.match(/\[Detected:\s*(.+?)\]\s*$/i);
    if (detectedMatch) {
      detectLabel.textContent = `Detected: ${detectedMatch[1]}`;
      translation = translation.replace(detectedMatch[0], "").trim();
    }

    targetText.value = translation;
    showStatus("✓ Translation complete!", "success");

  } catch (err) {
    showStatus(`✕ Error: ${err.message}`, "error");
    console.error("[LinguaShift Gemini]", err);
  } finally {
    setLoading(false);
  }
});

/* ── Copy translation ────────────────────────────────────────────────── */
copyBtn.addEventListener("click", async () => {
  const text = targetText.value.trim();
  if (!text) { showStatus("⚠  Nothing to copy yet.", "error"); return; }
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.classList.add("success");
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => {
      copyBtn.classList.remove("success");
      copyBtn.textContent = "📋 Copy Translation";
    }, 2200);
  } catch {
    targetText.select();
    document.execCommand("copy");
    showStatus("✓ Copied (fallback).", "success");
  }
});

/* ── Text-to-speech ──────────────────────────────────────────────────── */
const langMap = {
  English:"en-US", Spanish:"es-ES", French:"fr-FR", German:"de-DE",
  Italian:"it-IT", Portuguese:"pt-PT", Russian:"ru-RU", Japanese:"ja-JP",
  Chinese:"zh-CN", Korean:"ko-KR", Arabic:"ar-SA", Hindi:"hi-IN",
  Bengali:"bn-IN", Marathi:"mr-IN", Telugu:"te-IN", Tamil:"ta-IN",
  Urdu:"ur-PK", Dutch:"nl-NL", Polish:"pl-PL", Swedish:"sv-SE",
  Norwegian:"nb-NO", Danish:"da-DK", Finnish:"fi-FI", Greek:"el-GR",
  Turkish:"tr-TR", Hebrew:"he-IL", Thai:"th-TH", Vietnamese:"vi-VN",
  Indonesian:"id-ID", Malay:"ms-MY", Swahili:"sw-KE", Ukrainian:"uk-UA",
  Czech:"cs-CZ", Hungarian:"hu-HU", Romanian:"ro-RO"
};

function speak(text, langName) {
  if (!text) { showStatus("⚠  No text to speak.", "error"); return; }
  if (!("speechSynthesis" in window)) {
    showStatus("⚠  Text-to-speech not supported in this browser.", "error");
    return;
  }
  window.speechSynthesis.cancel();
  const utt  = new SpeechSynthesisUtterance(text);
  utt.lang   = langMap[langName] ?? "en-US";
  utt.rate   = 0.93;
  window.speechSynthesis.speak(utt);
}

speakSrcBtn.addEventListener("click", () =>
  speak(sourceText.value.trim(),
        sourceLang.value === "auto" ? "English" : sourceLang.value));

speakTgtBtn.addEventListener("click", () =>
  speak(targetText.value.trim(), targetLang.value));

/* ── Clear all ───────────────────────────────────────────────────────── */
clearBtn.addEventListener("click", () => {
  sourceText.value        = "";
  targetText.value        = "";
  charCount.textContent   = "0 / 2000";
  detectLabel.textContent = "";
  statusEl.className      = "status";
  window.speechSynthesis?.cancel();
});
