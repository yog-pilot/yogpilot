const chatForm = document.getElementById("chatForm");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messageTemplate = document.getElementById("messageTemplate");

function autoResizeTextarea() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${messageInput.scrollHeight}px`;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(role, text, isHtml = false) {
  const messageNode = messageTemplate.content.firstElementChild.cloneNode(true);
  const avatar = messageNode.querySelector(".avatar");
  const paragraph = messageNode.querySelector("p");

  messageNode.classList.add(role);
  avatar.textContent = role === "user" ? "YOU" : "AI";

  if (isHtml) {
    paragraph.innerHTML = text;
  } else {
    paragraph.textContent = text;
  }

  chatMessages.appendChild(messageNode);
  scrollToBottom();

  return messageNode;
}

function setLoadingState(isLoading) {
  sendButton.disabled = isLoading;
  messageInput.disabled = isLoading;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  console.log("Sending message:", message);

  addMessage("user", message);
  messageInput.value = "";
  autoResizeTextarea();
  setLoadingState(true);

  const loadingMessage = addMessage(
    "ai",
    '<span class="loading-dots"><span></span><span></span><span></span></span>',
    true
  );

  try {
    const response = await fetch("http://localhost:5000/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    loadingMessage.remove();

    if (!response.ok) {
      console.error("Server returned an error:", data);
      addMessage("ai", data.reply || "An error occurred while getting a response.");
      return;
    }

    addMessage("ai", data.reply || "No reply was received.");
  } catch (error) {
    loadingMessage.remove();
    console.error("Request failed:", error);
    addMessage("ai", "Unable to reach the server right now. Please try again.");
  } finally {
    setLoadingState(false);
    messageInput.focus();
  }
});

messageInput.addEventListener("input", autoResizeTextarea);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

autoResizeTextarea();
