const form       = document.getElementById("login-form");
const loginBtn   = document.getElementById("login-btn");
const btnLabel   = document.getElementById("btn-label");
const emailInput = document.getElementById("email");
const pwInput    = document.getElementById("password");
const errorMsg   = document.getElementById("error-msg");
const emailError = document.getElementById("email-error");
let submitting = false;

const THEMES = ["cyber", "minimal", "luxe", "glass"];

const THEME_CONFIG = {
  cyber:   { btn: "LOGIN",    authLabel: "AUTHENTICATING..." },
  minimal: { btn: "Continue", authLabel: "確認中..." },
  luxe:    { btn: "ENTER",    authLabel: "VERIFYING..." },
  glass:   { btn: "Sign In",  authLabel: "Signing in..." },
};

// ---- ストレージ ----
// プライベートブラウズ等でlocalStorageが例外を投げても初期化を止めない
function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 保存できなくてもテーマ適用は続行する
  }
}

// ---- テーマ ----
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  safeStorageSet("kk-theme", theme);
  if (!loginBtn.disabled) {
    btnLabel.textContent = THEME_CONFIG[theme]?.btn ?? "LOGIN";
  }
  document.querySelectorAll(".theme-dot").forEach(dot => {
    dot.classList.toggle("active", dot.dataset.themeVal === theme);
    dot.setAttribute("aria-pressed", dot.dataset.themeVal === theme ? "true" : "false");
  });
}

const savedTheme = safeStorageGet("kk-theme");
applyTheme(THEMES.includes(savedTheme) ? savedTheme : "cyber");

document.querySelectorAll(".theme-dot").forEach(dot => {
  dot.addEventListener("click", () => applyTheme(dot.dataset.themeVal));
});

// ---- ログイン処理 ----
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (submitting) return;

  const email = emailInput.value.trim();
  const pw    = pwInput.value;

  if (!email) {
    emailError.hidden = false;
    emailInput.closest(".field").classList.add("shake");
    setTimeout(() => emailInput.closest(".field").classList.remove("shake"), 400);
    return;
  }
  emailError.hidden = true;

  if (pw.length <= 4) {
    errorMsg.hidden = false;
    pwInput.closest(".field").classList.add("shake");
    setTimeout(() => pwInput.closest(".field").classList.remove("shake"), 400);
    return;
  }
  errorMsg.hidden = true;
  submitting = true;
  loginBtn.disabled = true;

  const theme = document.documentElement.dataset.theme;
  const loadingLines = {
    cyber:   ["> 接続を確立しています...", "> 認証プロトコルを初期化...", "> RSA-4096 鍵交換...", "> セキュアチャンネルを確立...", "> ユーザープロファイルを取得中...", "> アクセス権限を検証...", "> セッションを生成...", "> ログイン完了"],
    minimal: ["メールアドレスを確認しています", "パスワードを検証しています", "プロフィールを読み込み中", "完了しました"],
    luxe:    ["▸ 認証を開始します", "▸ 身元を確認しています", "▸ アクセス権を精査しています", "▸ 入室を許可します"],
    glass:   ["✦ Verifying credentials", "✦ Loading your space", "✦ Almost there", "✦ Done"],
  };

  btnLabel.textContent = THEME_CONFIG[theme]?.authLabel ?? "AUTHENTICATING...";
  document.getElementById("screen-login").hidden  = true;
  document.getElementById("screen-loading").hidden = false;

  startLoading(loadingLines[theme] || loadingLines.cyber, email);
});

// ---- ローディングログ演出 ----
function startLoading(lines, email) {
  const logEl = document.getElementById("loading-log");
  logEl.textContent = "";
  let i = 0;
  const tick = () => {
    if (i >= lines.length) {
      setTimeout(() => redirect(email), 400);
      return;
    }
    logEl.textContent += lines[i] + "\n";
    i++;
    setTimeout(tick, 260 + Math.random() * 200);
  };
  setTimeout(tick, 600);
}

// ---- success.html へリダイレクト ----
function redirect(email) {
  sessionStorage.setItem("kk-session", JSON.stringify({
    name:      email.split("@")[0].toUpperCase(),
    sessionId: Math.random().toString(36).slice(2, 10).toUpperCase(),
    loginTime: new Date().toLocaleTimeString("ja-JP"),
  }));
  location.href = "success.html";
}
