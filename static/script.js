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
    
    if (message === "") return;

    appendMessage(message, "user");
    userInput.value = "";
    
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apikey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'contents':[{'parts' : [{'text' : message}]}]})
    })
    .then(response => response.json())
    .then(data => {
        // 일단 data를 통해 컨텐츠가 해당 위치를 통해 들어오는 것을 확인했으나
        // https://learn.microsoft.com/en-us/microsoft-edge/web-platform/site-impacting-changes 사이트를 확인을 해서 처리할 것

        var return_message = data.candidates[0].contents.parts[0].text;
        

        if (return_message) {
            appendMessage(return_message, "bot");
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