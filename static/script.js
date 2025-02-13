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

async function sendMessage() {
    const message = userInput.value;
    const apikey = apikeyInput.value;

    if (message === "") return;

    appendMessage(message, "user");
    userInput.value = "";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apikey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 'contents': [{ 'parts': [{ 'text': message }] }] })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // 응답 상태 코드 확인
        }

        const data = await response.json();

        // 응답 데이터 구조에 대한 유효성 검사 추가 (중요)
        if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0 && data.candidates[0].content.parts[0].text) {
            const return_message = data.candidates[0].content.parts[0].text;
            appendMessage(return_message, "bot");
        } else {
            console.error("Invalid response structure:", data); // 콘솔에 자세한 오류 정보 출력
            appendMessage("오류가 발생했습니다. (Invalid response structure)", "bot");
        }

    } catch (error) {
        console.error("Fetch error:", error); // 콘솔에 자세한 오류 정보 출력
        appendMessage(`오류가 발생했습니다. (${error.message})`, "bot"); // 사용자에게 더 구체적인 오류 메시지 표시
    }
}

function sendOnEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

window.sendMessage = sendMessage;
window.sendOnEnter = sendOnEnter