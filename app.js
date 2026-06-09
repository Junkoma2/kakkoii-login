const form       = document.getElementById("login-form");
const loginBtn   = document.getElementById("login-btn");
const btnLabel   = document.getElementById("btn-label");
const emailInput = document.getElementById("email");
const pwInput    = document.getElementById("password");
const errorMsg   = document.getElementById("error-msg");
const emailError = document.getElementById("email-error");
const logoutBtn  = document.getElementById("logout-btn");

const screens = {
  login:   document.getElementById("screen-login"),
  loading: document.getElementById("screen-loading"),
  success: document.getElementById("screen-success"),
};

function show(name) {
  Object.values(screens).forEach((s) => s.hidden = true);
  screens[name].hidden = false;
  // スクロール位置をリセット
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
}

// ---- テーマ ----
const THEMES = ["cyber", "minimal", "luxe", "glass"];

const THEME_CONFIG = {
  cyber:   { btn: "LOGIN",    authLabel: "AUTHENTICATING..." },
  minimal: { btn: "Continue", authLabel: "確認中..." },
  luxe:    { btn: "ENTER",    authLabel: "VERIFYING..." },
  glass:   { btn: "Sign In",  authLabel: "Signing in..." },
};

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("kk-theme", theme);

  // ボタンラベルをテーマに合わせて更新（ログイン中でなければ）
  if (!loginBtn.disabled) {
    btnLabel.textContent = THEME_CONFIG[theme]?.btn ?? "LOGIN";
  }

  document.querySelectorAll(".theme-dot").forEach(dot => {
    dot.classList.toggle("active", dot.dataset.themeVal === theme);
    dot.setAttribute("aria-pressed", dot.dataset.themeVal === theme ? "true" : "false");
  });
}

const savedTheme = localStorage.getItem("kk-theme");
applyTheme(THEMES.includes(savedTheme) ? savedTheme : "cyber");

document.querySelectorAll(".theme-dot").forEach(dot => {
  dot.addEventListener("click", () => applyTheme(dot.dataset.themeVal));
});

// ---- ログイン処理 ----
form.addEventListener("submit", (e) => {
  e.preventDefault();
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
  loginBtn.disabled = true;

  const theme = document.documentElement.dataset.theme;
  const loadingLines = {
    cyber:   ["> 接続を確立しています...", "> 認証プロトコルを初期化...", "> RSA-4096 鍵交換...", "> セキュアチャンネルを確立...", "> ユーザープロファイルを取得中...", "> アクセス権限を検証...", "> セッションを生成...", "> ログイン完了"],
    minimal: ["メールアドレスを確認しています", "パスワードを検証しています", "プロフィールを読み込み中", "完了しました"],
    luxe:    ["▸ 認証を開始します", "▸ 身元を確認しています", "▸ アクセス権を精査しています", "▸ 入室を許可します"],
    glass:   ["✦ Verifying credentials", "✦ Loading your space", "✦ Almost there", "✦ Done"],
  };

  btnLabel.textContent = THEME_CONFIG[theme]?.authLabel ?? "AUTHENTICATING...";
  setTimeout(() => startLoading(loadingLines[theme] || loadingLines.cyber), 600);
});

// ---- ローディングログ演出 ----
function startLoading(lines) {
  show("loading");
  const logEl = document.getElementById("loading-log");
  logEl.textContent = "";
  let i = 0;
  const tick = () => {
    if (i >= lines.length) {
      setTimeout(() => showSuccess(), 400);
      return;
    }
    logEl.textContent += lines[i] + "\n";
    i++;
    setTimeout(tick, 260 + Math.random() * 200);
  };
  tick();
}

// ---- 成功画面 ----
function showSuccess() {
  show("success");

  const email = emailInput.value.trim();
  const name  = email.split("@")[0].toUpperCase();
  document.getElementById("welcome-name").textContent = "WELCOME, " + name;
  document.getElementById("session-id").textContent =
    Math.random().toString(36).slice(2, 10).toUpperCase();
  document.getElementById("login-time").textContent =
    new Date().toLocaleTimeString("ja-JP");

  setTimeout(() => document.getElementById("welcome-name").focus({ preventScroll: true }), 50);
}

// ---- ログアウト ----
logoutBtn.addEventListener("click", () => {
  emailInput.value  = "";
  pwInput.value     = "";
  emailError.hidden = true;
  errorMsg.hidden   = true;
  loginBtn.disabled = false;

  const theme = document.documentElement.dataset.theme;
  btnLabel.textContent = THEME_CONFIG[theme]?.btn ?? "LOGIN";
  show("login");
  emailInput.focus();
});
