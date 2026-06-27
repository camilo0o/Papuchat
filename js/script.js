const backButton = document.getElementById('back-button');
const app = document.querySelector('.app');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

let currentChat = null;


//navegacion mobile
backButton.addEventListener('click', () => {
    app.classList.remove('showing-chat');
    currentChat = null;
});

//cargar lista de chats

async function loadChats() {
    try{
        const cached = getChats();

        if (cached) {
            renderChatList(cached, openChat);
            return;
        }
        const chats = await apifetchChats();
        saveChats(chats);
        renderChatList(chats, openChat);
    } catch (error) {
        console.error('No se pudo cargar la lista de chats:', error);
        showChatsError();
    }
}

//abrir chat

async function openChat(chat) {
    currentChat = chat;
    setActiveChatItem(chat.idContacto);
    renderChatHeader(chat);
    app.classList.add('showing-chat');
    showMessagesLoading();
    try {
        const cached = getMessages(chat.idContacto);
 
        if (cached) {
            renderMessages(cached);
            return;
        }
 
        const mensajes = await apifetchMessages(chat.idContacto);
        saveMessages(chat.idContacto, mensajes);
        renderMessages(mensajes);
 
    } catch (error) {
        console.error('No se pudo cargar el historial:', error);
        showMessagesError();
    }

}

loadChats();

//envio de mensajes de texto
const sendButton = messageForm.querySelector('button[type="submit"]');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = messageInput.value.trim();
    if (!texto || !currentChat) return;

    sendButton.classList.remove('bounce');
    sendButton.offsetWidth; //forzar reflow para reiniciar la animación
    sendButton.classList.add('bounce');

    const msg = {
        id: `msg_${Date.now()}`,
        tipo: 'text',
        contenido: texto,
        timestamp: new Date().toISOString(),
        remitente: 'yo'
    };
    enviarMensaje(msg);
    messageInput.value = '';
    simularRespuesta();
});

function enviarMensaje(msg) {
    const mensajes = getMessages(currentChat.idContacto) || [];
    mensajes.push(msg);
    saveMessages(currentChat.idContacto, mensajes);
    appendMessage(msg);
    updateLastMessage(currentChat.idContacto, msg.tipo === 'image' ? '[Imagen]' : msg.contenido);
    updateChatItemLastMessage(currentChat.idContacto, msg.tipo === 'image' ? '[Imagen]' : msg.contenido);
}

//respuesta simulada
function simularRespuesta() {
    if (!currentChat) return;
    const idContacto = currentChat.idContacto;

    //mostrar "escribiendo..." casi de inmediato
    setTimeout(() => {
        if (currentChat && currentChat.idContacto === idContacto) {
            showTypingIndicator();
        }
    }, 300);

    setTimeout(() => {
        const mensajes = getMessages(idContacto) || [];
        //solo los mensajes de texto del contacto como posibles para respuestas
        const posibles = mensajes.filter(m => m.remitente === 'el' && m.tipo === 'text');

        if (currentChat && currentChat.idContacto === idContacto) {
            hideTypingIndicator();
        }

        if (posibles.length === 0) return;
        const original = posibles[Math.floor(Math.random() * posibles.length)];
        const msg = {
            id: `msg_${Date.now()}`,
            tipo: 'text',
            contenido: original.contenido,
            timestamp: new Date().toISOString(),
            remitente: 'el'
        }
        mensajes.push(msg);
        saveMessages(idContacto, mensajes);

        if (currentChat && currentChat.idContacto === idContacto) {
            appendMessage(msg);
            updateLastMessage(idContacto, msg.contenido);
            updateChatItemLastMessage(idContacto, msg.contenido);
        }
    }, 3000);
}

//carga de imagenes con fileReader
const imageInput = document.getElementById('image-input');


imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file || !currentChat) return;
 
    const reader = new FileReader();
 
    reader.addEventListener('load', () => {
        const msg = {
            id: `msg_${Date.now()}`,
            tipo: 'image',
            contenido: reader.result,
            timestamp: new Date().toISOString(),
            remitente: 'yo'
        };
 
        enviarMensaje(msg);
        imageInput.value = '';
    });
 
    reader.readAsDataURL(file);
});