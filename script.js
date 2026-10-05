function scrollToId(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// floating muted-yellow petals (flowers, not bright)
const petalBox = document.getElementById("petals");
const flowers = ["🌼", "🌻", "🌸", "🏵️", "🌼"];
for (let i = 0; i < 18; i++) {
  const p = document.createElement("div");
  p.className = "petal";
  p.textContent = flowers[Math.floor(Math.random() * flowers.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = 14 + Math.random() * 18 + "px";
  p.style.opacity = 0.35 + Math.random() * 0.4;
  p.style.animationDuration = 6 + Math.random() * 7 + "s";
  p.style.animationDelay = Math.random() * 7 + "s";
  petalBox.appendChild(p);
}

// flower giver
let count = 1;
const display = document.getElementById("flowerDisplay");
const countEl = document.getElementById("flowerCount");
const jokeEl = document.getElementById("jokeLine");
const sagingJokes = [
  "Hoy, bulaklak bigay mo, hindi saging! Sige, counted pa rin.",
  "Okay, isang saging para kay Ma'am/Sir... este bulaklak pala!",
  "Ang puno ng saging ay proud sa'yo.",
  "Teacher: 'Saging na naman?!' Pero kinilig pa rin.",
  "Mabuhay! Dadagdagan natin ng puso ng saging sa lunch.",
];

document.getElementById("giveBtn").onclick = () => {
  count++;
  display.textContent += "🌼";
  if (display.textContent.length > 60) display.textContent = "🌼".repeat(15);
  countEl.textContent = count;
  jokeEl.textContent = "";
};

document.getElementById("sagingBtn").onclick = () => {
  display.textContent += "🍌";
  count++;
  countEl.textContent = count;
  jokeEl.textContent =
    sagingJokes[Math.floor(Math.random() * sagingJokes.length)];
};

// message wall - shared via Firebase (for GitHub Pages) + local fallback
// cleared for fresh start - no example messages
const defaults = [];
const box = document.getElementById("messages");
const wallStatus = document.getElementById("wallStatus");
const wallHint = document.getElementById("wallHint");

function clearWall() {
  box.innerHTML = "";
}
function renderMsg(n, m) {
  const d = document.createElement("div");
  d.className = "msg";
  d.innerHTML = `<strong></strong><p></p><small>from 8-Copernicus</small>`;
  d.querySelector("strong").textContent = n;
  d.querySelector("p").textContent = m;
  box.prepend(d);
}

let useFirebase = false;
let db = null;

function isFirebaseConfigured() {
  return (
    typeof firebase !== "undefined" &&
    window.FIREBASE_CONFIG &&
    window.FIREBASE_CONFIG.apiKey &&
    !window.FIREBASE_CONFIG.apiKey.includes("PASTE")
  );
}

function initLocalWall() {
  clearWall();
  defaults.forEach((o) => renderMsg(o.n, o.m));
  try {
    const saved = JSON.parse(localStorage.getItem("teacher-wall") || "[]");
    saved.forEach((o) => renderMsg(o.n, o.m));
  } catch (e) {}
  if (wallStatus)
    wallStatus.textContent =
      "🌼 Local preview mode — messages save on this device only. Connect Firebase to share with class.";
  if (wallHint)
    wallHint.textContent =
      "Tip: gumawa ng Firebase project (libre) para magkita-kita ang messages ng buong klase kahit naka-GitHub Pages.";
}

function initFirebaseWall() {
  try {
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    db = firebase.firestore();
    useFirebase = true;
    if (wallStatus)
      wallStatus.textContent =
        "💛 Shared wall • live — lahat ng classmates makikita ito!";
    if (wallHint) wallHint.textContent = "";
    clearWall();
    defaults.forEach((o) => renderMsg(o.n, o.m));
    // live updates, newest first
    db.collection("messages")
      .orderBy("createdAt", "desc")
      .limit(100)
      .onSnapshot(
        (snap) => {
          clearWall();
          defaults.forEach((o) => renderMsg(o.n, o.m));
          // snapshot is desc, render reversed so newest ends on top after prepend
          const docs = snap.docs.slice().reverse();
          docs.forEach((doc) => {
            const data = doc.data();
            if (data && data.m)
              renderMsg(data.n || "Anonymous student", data.m);
          });
          if (wallStatus)
            wallStatus.textContent = `💛 Shared wall • live • ${snap.size} class messages`;
        },
        (err) => {
          console.error(err);
          initLocalWall();
          if (wallStatus)
            wallStatus.textContent =
              "⚠️ Firebase blocked (check Firestore Rules). Showing local mode.";
        },
      );
  } catch (e) {
    console.error(e);
    initLocalWall();
  }
}

function addMessage() {
  const nameEl = document.getElementById("nameInput");
  const msgEl = document.getElementById("msgInput");
  const n = nameEl.value.trim() || "Anonymous student";
  const m = msgEl.value.trim();
  if (!m) {
    alert("Write a message muna before posting!");
    return;
  }
  if (m.length > 300) {
    alert("Max 300 chars lang po!");
    return;
  }

  if (useFirebase && db) {
    db.collection("messages")
      .add({
        n: n.slice(0, 40),
        m: m.slice(0, 300),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        msgEl.value = "";
        nameEl.value = "";
      })
      .catch((e) => {
        console.error(e);
        alert(
          "Ayaw ma-post. Check internet / Firestore Rules. Error: " + e.message,
        );
      });
  } else {
    renderMsg(n, m);
    msgEl.value = "";
    nameEl.value = "";
    try {
      const saved = JSON.parse(localStorage.getItem("teacher-wall") || "[]");
      saved.push({ n, m });
      localStorage.setItem("teacher-wall", JSON.stringify(saved));
    } catch (e) {}
  }
}

if (isFirebaseConfigured()) {
  initFirebaseWall();
} else {
  initLocalWall();
}
