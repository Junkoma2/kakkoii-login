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
}

// ---- ログイン処理 ----
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const pw = pwInput.value;
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
  btnLabel.textContent = "AUTHENTICATING...";
  setTimeout(() => startLoading(), 600);
});

// ---- ローディングログ演出 ----
const LOG_LINES = [
  "> 接続を確立しています...",
  "> 認証プロトコルを初期化...",
  "> RSA-4096 鍵交換...",
  "> セキュアチャンネルを確立...",
  "> ユーザープロファイルを取得中...",
  "> アクセス権限を検証...",
  "> セッションを生成...",
  "> ログイン完了",
];

function startLoading() {
  show("loading");
  const logEl = document.getElementById("loading-log");
  logEl.textContent = "";
  let i = 0;
  const tick = () => {
    if (i >= LOG_LINES.length) {
      setTimeout(() => showSuccess(), 500);
      return;
    }
    logEl.textContent += LOG_LINES[i] + "\n";
    i++;
    setTimeout(tick, 280 + Math.random() * 220);
  };
  tick();
}

// ---- 成功画面 ----
function showSuccess() {
  show("success");

  const email = emailInput.value.trim();
  const name = email.split("@")[0].toUpperCase();
  document.getElementById("welcome-name").textContent = "WELCOME, " + name;

  document.getElementById("session-id").textContent =
    Math.random().toString(36).slice(2, 10).toUpperCase();

  const now = new Date();
  document.getElementById("login-time").textContent =
    now.toLocaleTimeString("ja-JP");
}

// ---- ログアウト ----
logoutBtn.addEventListener("click", () => {
  emailInput.value = "";
  pwInput.value = "";
  emailError.hidden = true;
  errorMsg.hidden = true;
  loginBtn.disabled = false;
  btnLabel.textContent = "LOGIN";
  show("login");
});
