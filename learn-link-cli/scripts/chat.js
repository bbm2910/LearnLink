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
    const recipientInput = document.getElementById("recipientId")
    const messageContainer = document.getElementById("messageContainer")

    let currentRecipient = null

    //Send a message
    sendBtn.addEventListener("click", () => {
        const message = messageInput.value.trim()
        const recipientId = recipientInput.value.trim()

        if(!message || !recipientId) return;

        currentRecipient = recipientId

        console.log("Sending Message (chat.js)", {
            recipientId: recipientId,
            message: messageInput.value
        }); // err log
       
        socket.emit("private_message", {
        recipientId: recipientId,  
        message: message
  });
        messageInput.value = "";
    });

    //Receive message
    socket.on("private_message", (data) => {

        console.log("📥 Message received:", data); //err log

        const div = document.createElement("div")
        div.className = "mb-1"
        div.innerHTML = `<strong>${data.senderId}</strong>: ${data.message}`
        messageContainer.appendChild(div)
        messageContainer.scrollTop = messageContainer.scrollHeight
    })

    //Get chat history 
    recipientInput.addEventListener("change", () => {
        const withUserId = recipientInput.value.trim()
        currentRecipient = withUserId

        if(withUserId){
            socket.emit("get_chat_history", { withUserId })
        }
    });

    socket.on("chat_history", (messages) => {
        messageContainer.innerHTML = "";
        messages.forEach((msg) => {
            const div = document.createElement("div")
            div.className = "mb-1"
            div.innerHTML = `<strong>${msg.senderId}</strong>: ${msg.content}`
            messageContainer.appendChild(div)
        })
        messageContainer.scrollTop = messageContainer.scrollHeight
    })
    socket.on("error", (err) => {
        console.error("❌ Socket error received from server:", err);
        alert(err.message || "Socket Error")
    })

})