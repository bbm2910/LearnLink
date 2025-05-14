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

        console.log("Sending Message (chat.js)", {
            recipientEmail,
            message
        }); // err log
       
        socket.emit("private_message", {
        recipientEmail,     
        message
  });
        messageInput.value = "";
    });

    //Receive message
    socket.on("private_message", (data) => {
        const div = document.createElement("div");
        div.className = "mb-1";

        const currentUserId = parseInt(localStorage.getItem("user_id"));  // force to number
        const isSender = data.senderId === currentUserId;
        const label = isSender ? "You" : data.senderEmail || currentRecipientEmail;

        div.innerHTML = `<strong>${label}</strong>: ${data.message}`;
        messageContainer.appendChild(div);
        messageContainer.scrollTop = messageContainer.scrollHeight;

        // const div = document.createElement("div");
        // div.className = "mb-1";

        // const isSender = data.senderId == currentUserId;
        // const label = isSender ? "You" : currentRecipientEmail;

        // div.innerHTML = `<strong>${label}</strong>: ${data.message}`;
        // messageContainer.appendChild(div);
        // messageContainer.scrollTop = messageContainer.scrollHeight;

        // console.log("📥 Message received:", data); //err log
        // const currentUserId = localStorage.getItem("user_id");
        // const div = document.createElement("div");
        // div.className = "mb-1";
        // const senderName = (data.senderId == currentUserId) ? "You" : data.senderId;
        // div.innerHTML = `<strong>${senderName}</strong>: ${data.message}`;
        // messageContainer.appendChild(div);
        // messageContainer.scrollTop = messageContainer.scrollHeight;

    })

    //Get chat history 
    recipientEmailInput.addEventListener("change", () => {
        const email = recipientEmailInput.value.trim();
        if (!email) return;

        currentRecipientEmail = email;
        socket.emit("get_chat_history_by_email", { email });
        // const withUserId = recipientInput.value.trim()
        // currentRecipient = withUserId

        // if(withUserId){
        //     socket.emit("get_chat_history", { withUserId })
        // }
    });

    socket.on("chat_history", (messages) => {
        messageContainer.innerHTML = "";

        messages.forEach((msg) => {
         const div = document.createElement("div");
         div.className = "mb-1";
         const isSender = msg.senderId == currentUserId;
         const label = isSender ? "You" : currentRecipientEmail;
          div.innerHTML = `<strong>${label}</strong>: ${msg.content}`;
         messageContainer.appendChild(div);
        // const currentUserId = localStorage.getItem("user_id");
        // messageContainer.innerHTML = "";

        // messages.forEach((msg) => {
        //     const div = document.createElement("div");
        //     div.className = "mb-1";
        //     const senderName = (msg.senderId == currentUserId) ? "You" : msg.senderId;
        //     div.innerHTML = `<strong>${senderName}</strong>: ${msg.content}`;
        //     messageContainer.appendChild(div);
        });

        messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    socket.on("error", (err) => {
        console.error("❌ Socket error:", err);
        alert(err.message || "Socket Error");
    });
});

// messageContainer.innerHTML = "";
        // messages.forEach((msg) => {
        //     const label = msg.sender_id === parseInt(localStorage.getItem("user_id")) ? "You" : `User ${msg.sender_id}`;
        //     const div = document.createElement("div");
        //     div.className = "mb-1";
        //     div.innerHTML = `<strong>${label}</strong>: ${msg.message}`;
        //     messageContainer.appendChild(div);
        //})
        // messageContainer.scrollTop = messageContainer.scrollHeight