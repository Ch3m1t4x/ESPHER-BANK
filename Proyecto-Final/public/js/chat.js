function chat(question, answer) {
    var chat = document.getElementById('chat');
    chat.innerHTML += '<p class="question"><strong>Tú:</strong> ' + question + '</p>';
    chat.innerHTML += '<p class="answer"><strong>Chat:</strong> ' + answer + '</p>';
    chat.scrollTop = chat.scrollHeight;
}