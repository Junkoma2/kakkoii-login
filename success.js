const session = JSON.parse(sessionStorage.getItem("kk-session") || "null");

// セッションなしで直接アクセスされたらログイン画面へ
if (!session) {
  location.replace("index.html");
}

// テーマ復元
const THEMES = ["cyber", "minimal", "luxe", "glass"];
const savedTheme = localStorage.getItem("kk-theme");
document.documentElement.dataset.theme = THEMES.includes(savedTheme) ? savedTheme : "cyber";

// 情報表示
document.getElementById("welcome-name").textContent = "WELCOME, " + session.name;
document.getElementById("session-id").textContent   = session.sessionId;
document.getElementById("login-time").textContent   = session.loginTime;

setTimeout(() => document.getElementById("welcome-name").focus({ preventScroll: true }), 100);

// ログアウト
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("kk-session");
  location.href = "index.html";
});
