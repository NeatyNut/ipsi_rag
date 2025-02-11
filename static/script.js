let chatbotMessages = document.getElementById("chatbot-messages");
let userInput = document.getElementById("user-input");
let apikeyInput = document.getElementById("apikey");

function appendMessage(text, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = text;
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to the latest message
}

function sendMessage() {
    var message = userInput.value;
    var apikey = apikeyInput.value;
    console.log(apikey);
    
    if (message === "") return;

    appendMessage(message, "user");
    userInput.value = "";
    
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?${apikey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.reply) {
            appendMessage(data.reply, "bot");
        } else {
            appendMessage("오류가 발생했습니다.", "bot");
        }
    })
    .catch(() => appendMessage("오류가 발생했습니다.", "bot"));
}

function sendOnEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

window.sendMessage = sendMessage;
window.sendOnEnter = sendOnEnter