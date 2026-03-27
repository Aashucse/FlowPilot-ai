function addMessage(text, type) {
  const chatBox = document.getElementById("chatBox");

  const message = document.createElement("div");
  message.className = `message ${type === "user" ? "user-message" : "ai-message"}`;

  const label = document.createElement("div");
  label.className = "msg-label";
  label.textContent = type === "user" ? "You" : "FlowPilot AI";

  const body = document.createElement("div");
  body.className = "msg-text";

  if (type === "ai") {
    typeWriter(body, text);
  } else {
    body.textContent = text;
  }

  message.appendChild(label);
  message.appendChild(body);
  chatBox.appendChild(message);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function typeWriter(element, text) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, 8);
    }
  }
  typing();
}

function showLoading() {
  const chatBox = document.getElementById("chatBox");

  const message = document.createElement("div");
  message.className = "message ai-message";
  message.id = "loadingMessage";

  const label = document.createElement("div");
  label.className = "msg-label";
  label.textContent = "FlowPilot AI";

  const body = document.createElement("div");
  body.className = "msg-text";
  body.innerHTML = `
        <div class="typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;

  message.appendChild(label);
  message.appendChild(body);
  chatBox.appendChild(message);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoading() {
  const loading = document.getElementById("loadingMessage");
  if (loading) loading.remove();
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  showLoading();

  fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      removeLoading();
      addMessage(data.response, "ai");
    })
    .catch(() => {
      removeLoading();
      addMessage("Something went wrong while processing your request.", "ai");
    });
}

function clearChat() {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = `
        <div class="message ai-message">
            <div class="msg-label">FlowPilot AI</div>
            <div class="msg-text">
                Hello! Ask me anything, or enter multiple tasks separated by commas and I will help you organize them.
            </div>
        </div>
    `;
}

function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    document.getElementById("userInput").value = event.results[0][0].transcript;
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("userInput");

  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});
