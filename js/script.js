const backButton = document.getElementById('back-button');
const app = document.querySelector('.app');

backButton.addEventListener('click', () => {
    app.classList.remove('showing-chat');
});
document.querySelectorAll('.chat-container').forEach(item => {
    item.addEventListener('click', () => {
        app.classList.add('showing-chat');
    });
});