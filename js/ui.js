//renderizado del dom

const chatListEl = document.getElementById('chat-list-items');
const messagesEl = document.getElementById('messages');
const chatUsernameEl = document.getElementById('chat-username');
const chatAvatarEl = document.getElementById('chat-avatar');

function renderChatList(chats, onChatClick) {
    chatListEl.innerHTML = '';
    chats.forEach(chat => {
        const li = document.createElement('li');
        li.classList.add('chat-item');
        li.setAttribute('tabindex', '0');
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `abrir conversación con ${chat.nombre}`);
        li.dataset.id = chat.idContacto;
        li.innerHTML = `
            <div class="avatar" aria-hidden="true">${chat.nombre[0].toUpperCase()}</div>
            <div class="chat-info">
                <h3>${chat.nombre}</h3>
                <p class="chat-item__last-msg">${chat.ultMensaje}</p>
            </div>
        `;

        li.addEventListener('click', () => onChatClick(chat));
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') onChatClick(chat);
        });
        chatListEl.appendChild(li);

    });
}

function showMessagesLoading() {
    messagesEl.innerHTML = '<p class="chat-loading">Cargando mensajes...</p>';
}

function showMessagesError() {
    messagesEl.innerHTML = '<p class="chat-error">No se pudo cargar el historial.</p>';
}

function showChatsError() {
    chatListEl.innerHTML = '<li class="chat-error">No se pudieron cargar los chats.</li>';
}
 
function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
}

function setActiveChatItem(idContacto) {
    document.querySelectorAll('.chat-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === idContacto);
    });
}

function renderChatHeader(chat) {
    chatUsernameEl.textContent = chat.nombre;
    chatAvatarEl.textContent = chat.nombre[0].toUpperCase();
    chatAvatarEl.setAttribute('aria-label', `Avatar de ${chat.nombre}`);
}

function renderMessages(mensajes) {
    messagesEl.innerHTML = '';
    mensajes.forEach(msg => appendMessage(msg));
    scrollToBottom();
}

function appendMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message', msg.remitente === 'yo' ? 'message--sent' : 'message--received');

    if(msg.tipo === 'image'){
        const img = document.createElement('img');
        img.src = msg.contenido;
        img.alt = 'Imagen adjunta';
        img.classList.add('message-image');
        div.appendChild(img);
    }else{
        const text = document.createElement('span');
        text.classList.add('message-text');
        text.textContent = msg.contenido;
        div.appendChild(text);
    }

    const time = document.createElement('span');
    time.classList.add('message-time');
    time.textContent = formatTime(msg.timestamp);
    div.appendChild(time);

    messagesEl.appendChild(div);
    scrollToBottom();
}

function updateChatItemLastMessage(idContacto, texto) {
    const item = chatListEl.querySelector(`[data-id="${idContacto}"] .chat-item__last-msg`);
    if (item) item.textContent = texto;

}

function showTypingIndicator(){
    const existing = document.getElementById('typing-indicator');
    if(existing) return;

    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.classList.add('typing-indicator');
    div.setAttribute('aria-label', 'Escribiendo...');
    div.innerHTML = '<span></span><span></span><span></span>';
 
    messagesEl.appendChild(div);
    scrollToBottom();
}

function hideTypingIndicator(){
    const existing = document.getElementById('typing-indicator');
    if (existing) existing.remove();
}