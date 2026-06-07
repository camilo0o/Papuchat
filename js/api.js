const BASE_URL = 'https://max-fernandez-utec.github.io/2026/papuchat';

async function apifetchChats() {
    const res = await fetch(`${BASE_URL}/chats`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status} al obtener chats`);
    const data = await res.json();
    return data.chats;
}

async function apifetchMessages(idContacto) {
    const res = await fetch(`${BASE_URL}/chats/${idContacto}`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status} al obtener mensajes del contacto ${idContacto}`);
    const data = await res.json();
    return data.mensajes;
}