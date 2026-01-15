// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCHUuvqbKNu6isOoYH8irvVfGU99T_7qyI",
  authDomain: "codex-heist.firebaseapp.com",
  databaseURL: "https://codex-heist-default-rtdb.firebaseio.com",
  projectId: "codex-heist",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// App state
let currentUser = null;
let currentRoom = "global";
let typingTimeout;

// Splash → Login
setTimeout(() => {
  splash.style.display = "none";
  login.style.display = "flex";
}, 4000);

// ----- AUTH -----
function handleLogin() {
  const emailVal = email.value.trim();
  const passVal = password.value.trim();
  if (!emailVal || !passVal) return;

  auth.signInWithEmailAndPassword(emailVal, passVal)
    .catch(() => {
      return auth.createUserWithEmailAndPassword(emailVal, passVal);
    })
    .then(res => {
      currentUser = res.user;
      login.style.display = "none";
      app.style.display = "flex";
      loadChat();
    })
    .catch(err => alert(err.message));
}

// ----- CHAT -----
function loadChat() {
  // presence
  db.ref("presence/" + currentRoom + "/" + currentUser.uid).set(currentUser.email);
  db.ref("presence/" + currentRoom + "/" + currentUser.uid).onDisconnect().remove();

  db.ref("presence/" + currentRoom).on("value", snap => {
    onlineUsers.innerText = Object.keys(snap.val() || {}).length + " online";
  });

  // messages
  db.ref("rooms/" + currentRoom).off();
  db.ref("rooms/" + currentRoom).limitToLast(200).on("child_added", snap => {
    const m = snap.val();
    displayMessage(m);
  });

  // typing
  db.ref("typing/" + currentRoom).on("value", snap => {
    let text = "";
    snap.forEach(x => {
      if (x.key !== currentUser.uid) text += "Someone is typing… ";
    });
    typingIndicator.innerText = text;
  });
}

function displayMessage(m) {
  const div = document.createElement("div");
  div.className = "msg " + (m.uid === currentUser.uid ? "me" : "other");
  div.innerHTML = `<div class="user">${m.email.split("@")[0]}</div>${m.text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const text = msg.value.trim();
  if (!text) return;
  db.ref("rooms/" + currentRoom).push({
    uid: currentUser.uid,
    email: currentUser.email,
    text: text,
    time: Date.now()
  });
  msg.value = "";
}

// ----- DAYS BEFORE CLEAR TYPING -----
msg.oninput = () => {
  db.ref("typing/" + currentRoom + "/" + currentUser.uid).set(true);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    db.ref("typing/" + currentRoom + "/" + currentUser.uid).remove();
  }, 1500);
};

// ----- ROOMS -----
function joinRoom() {
  const c = roomCode.value.trim();
  if (!c) return;
  currentRoom = c;
  messages.innerHTML = "";
  loadChat();
  closeMenu();
}

function goGlobal() {
  currentRoom = "global";
  messages.innerHTML = "";
  loadChat();
  closeMenu();
}

// ----- MENU -----
menuBtn.onclick = () => menu.style.display = "block";
function closeMenu() {
  menu.style.display = "none";
}

// ----- ADMIN PANEL -----
function openAdmin() {
  closeMenu();
  const userToBan = prompt("Ban user (enter email username part):");
  if (!userToBan) return;
  db.ref("bans/" + currentRoom + "/" + userToBan).set(true);
  alert(userToBan + " banned in this room.");
}

// ----- BANS ENFORCED -----
db.ref("bans/" + currentRoom).on("value", snap => {
  snap.forEach(x => {
    if (currentUser && currentUser.email.includes(x.key)) {
      alert("You are banned from this room!");
      goGlobal();
    }
  });
});
