const firebaseConfig = {
  apiKey: "AIzaSyCHUuvqbKNu6isOoYH8irvVfGU99T_7qyI",
  authDomain: "codex-heist.firebaseapp.com",
  databaseURL: "https://codex-heist-default-rtdb.firebaseio.com",
  projectId: "codex-heist",
  storageBucket: "codex-heist.firebasestorage.app",
  messagingSenderId: "1005814826180",
  appId: "1:1005814826180:web:6347793d110811794a7591"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let room = "global";
let username = "User" + Math.floor(Math.random()*9999);
let typingRef;

setTimeout(()=>{
  document.getElementById("splash").style.display="none";
  document.getElementById("app").style.display="flex";
  joinRoom("global");
},5000);

function joinRoom(code){
  room = code || document.getElementById("roomCode").value || "global";
  db.ref("rooms/"+room+"/messages").off();
  document.getElementById("messages").innerHTML="";
  db.ref("rooms/"+room+"/messages").on("child_added", snap=>{
    addMessage(snap.val());
  });
  closeMenu();
}

function send(){
  const input=document.getElementById("msg");
  if(!input.value) return;
  db.ref("rooms/"+room+"/messages").push({
    user:username,
    text:input.value
  });
  input.value="";
}

function addMessage(data){
  const div=document.createElement("div");
  div.className="msg"+(data.user===username?" me":"");
  div.innerHTML="<div class='user'>"+data.user+"</div>"+data.text;
  messages.appendChild(div);
  messages.scrollTop=messages.scrollHeight;
}

/* Menu */
menuBtn.onclick=()=>menu.style.display="block";
function closeMenu(){menu.style.display="none"}
function goGlobal(){joinRoom("global")}
function clearChat(){messages.innerHTML=""}
