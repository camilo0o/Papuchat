//manejo de almacenamiento local (localStorage)

const STORAGE_KEYS = {
    CHATS: 'papuchat_chats',
    MESSAGES: (idContacto) => `papuchat_msgs_${idContacto}`
};
 
function getChats() {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    return data ? JSON.parse(data) : null;
}
 
function saveChats(chats) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
}
 
function getMessages(idContacto) {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES(idContacto));
    return data ? JSON.parse(data) : null;
}
 
function saveMessages(idContacto, mensajes) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES(idContacto), JSON.stringify(mensajes));
}
 
function updateLastMessage(idContacto, texto) {
    const chats = getChats();
    if (!chats) return;
    const chat = chats.find(c => c.idContacto === idContacto);
    if (chat) {
        chat.ultMensaje = texto;
        saveChats(chats);
    }
}
