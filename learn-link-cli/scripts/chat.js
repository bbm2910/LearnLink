document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:3000", {
        auth: {
            token : localStorage.getItem("token")
        }
    })

    socket.on("connect", () => {
    console.log("Connected to Socket.IO server with ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
    console.error("Connection failed:", err.message);
    });

    const messageInput = document.getElementById("messageInput")
    const sendBtn = document.getElementById("sendBtn")
    const recipientEmailInput = document.getElementById("recipientEmail")
    const messageContainer = document.getElementById("messageContainer")


    let currentRecipientEmail = null
    let currentRecipientId = null
    const currentUserId = localStorage.getItem("user_id")
    let currentRecipient = null

    //Send a message
    sendBtn.addEventListener("click", () => {
        const message = messageInput.value.trim()
        const recipientEmail = recipientEmailInput.value.trim()

        if(!message || !recipientEmail) return;

        currentRecipient = recipientEmail

        socket.emit("private_message", {
        recipientEmail,     
        message
  });
        messageInput.value = "";
    });

    socket.on("private_message", (data) => {
        
        const div = document.createElement("div");
        const isSender = String(data.senderId) === String(currentUserId);
        console.log("PM isSender: ", isSender);
        div.className = `message ${isSender ? "from-me" : "from-them"}`;
        div.innerHTML = `<strong>${isSender ? "You" : data.senderEmail || currentRecipientEmail}:</strong> ${data.message}`;
        messageContainer.appendChild(div);
        messageContainer.scrollTop = messageContainer.scrollHeight;


    })

    //Get chat history 
    recipientEmailInput.addEventListener("change", () => {
        const email = recipientEmailInput.value.trim();
        if (!email) return;

        currentRecipientEmail = email;
        socket.emit("get_chat_history_by_email", { email });
    
    });

    socket.on("chat_history", (messages) => {
        messageContainer.innerHTML = "";

        messages.forEach((msg) => {
        const div = document.createElement("div");
        const isSender = String(msg.senderId) === String(currentUserId);
        
        console.log("CH isSender: ", isSender);
        div.className = `message ${isSender ? "from-me" : "from-them"}`;
        div.innerHTML = `<strong>${isSender ? "You" : msg.senderEmail}:</strong> ${msg.content}`;
        messageContainer.appendChild(div);
    
        });

        messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    socket.on("error", (err) => {
        console.error("❌ Socket error:", err);
        alert(err.message || "Socket Error");
    });
});

