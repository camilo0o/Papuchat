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