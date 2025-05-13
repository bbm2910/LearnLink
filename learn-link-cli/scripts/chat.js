const token = localStorage.getItem("token")

if(!token){
    console.log("No JWT Token found, user may not be authenticated");
} else {
    const socket = io("http://localhost:3000", {
        auth: { token },
    });

    socket.on("connect", () => {
        console.log("Connected to chat via WebSocket!");
    });

    socket.on("private_message", ({senderId, message}) => {
        console.log(`New Message from ${senderId}: ${message}`);
    });

    window.sendMessage = function (recipient_Id, message){
        socket.emit("private_message", { recipient_Id, message})
    };
}