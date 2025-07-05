const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingDiv = document.getElementById('typing');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPanel = document.getElementById('emoji-panel');
const darkToggle = document.getElementById('dark-toggle');
const chatWith = document.getElementById('chat-with');

let username = '';
let typingTimeout;

const emojis = ['😀','😃','😂','🤣','😊','😎','😍','😘','😜','😢','👍','🙏','👏','💡','🎉'];

function initEmojis(){
    emojis.forEach(e=>{
        const b=document.createElement('button');
        b.textContent=e;
        b.addEventListener('click',()=>{
            messageInput.value+=e;
            emojiPanel.classList.add('hidden');
            messageInput.focus();
        });
        emojiPanel.appendChild(b);
    });
}

function loadMessages(){
    const data = JSON.parse(localStorage.getItem('chat-messages')||'[]');
    messagesDiv.innerHTML='';
    data.forEach(m=>addMessageToDOM(m));
    messagesDiv.scrollTop=messagesDiv.scrollHeight;
}

function addMessageToDOM(msg){
    const div=document.createElement('div');
    div.classList.add('message');
    div.classList.add(msg.user===username ? 'sent':'received');
    div.innerHTML=`<span>${msg.text}</span><div class="timestamp">${new Date(msg.time).toLocaleTimeString()}</div>`;
    messagesDiv.appendChild(div);
}

function sendMessage(){
    const text=messageInput.value.trim();
    if(!text) return;
    const msg={user:username,text,time:Date.now()};
    const data=JSON.parse(localStorage.getItem('chat-messages')||'[]');
    data.push(msg);
    localStorage.setItem('chat-messages',JSON.stringify(data));
    messageInput.value='';
    triggerStorage(); // to notify other tabs
    loadMessages();
    playSound();
}

function playSound(){
    const audio=new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');
    audio.play();
}

function triggerStorage(){
    localStorage.setItem('chat-update',Date.now());
}

function startChat(){
    username=usernameInput.value.trim();
    if(!username) return;
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    chatWith.textContent=`Chatting as ${username}`;
    loadMessages();
}

function handleTyping(){
    localStorage.setItem('typing',username);
    clearTimeout(typingTimeout);
    typingTimeout=setTimeout(()=>{
        if(localStorage.getItem('typing')===username){
            localStorage.removeItem('typing');
        }
    },1000);
}

loginBtn.addEventListener('click',startChat);
messageInput.addEventListener('keydown',handleTyping);
sendBtn.addEventListener('click',sendMessage);
messageInput.addEventListener('keypress',e=>{ if(e.key==='Enter') sendMessage(); });
emojiBtn.addEventListener('click',()=>emojiPanel.classList.toggle('hidden'));

darkToggle.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
});

window.addEventListener('storage',e=>{
    if(e.key==='chat-messages' || e.key==='chat-update'){
        loadMessages();
    }
    if(e.key==='typing'){
        if(e.newValue && e.newValue!==username){
            typingDiv.classList.remove('hidden');
        } else {
            typingDiv.classList.add('hidden');
        }
    }
});

document.addEventListener('DOMContentLoaded',initEmojis);
