const { Message } = require('../models/Message');

function handleSocketEvents(io, socket) {
    const userId = socket.user.user_id;
    console.log(`Controller userID: ${userId}`);
    socket.join(`user_${userId}`);

    // Send private message
    socket.on("private_message", async ({ recipientId, message }) => {

        console.log("📨 Received private_message:", { recipientId, message });

        if (!recipientId || !message) {
            console.log("userId: ", userId);
            console.log("⚠️ Missing recipientId or message");
            socket.emit("error", { message: "Recipient or message missing" });
        return; //err log
    }

        try {
            const savedMessage = await Message.create({
                sender_id: userId,
                recipient_id: recipientId,
                message,
            });

            console.log("✅ Message saved to DB:", savedMessage);

            // io.to(`user_${recipientId}`).emit("private_message", {
            //     senderId: userId,
            //     message: savedMessage.message,
            //     timestamp: savedMessage.sent_at,
            // });

            // socket.emit("private_message", {
            //     senderId: userId,
            //     message: savedMessage.message,
            //     timestamp: savedMessage.sent_at,
            // });
            const payload = {
                senderId: userId,
                recipientId,
                message: savedMessage.message,
                timestamp: savedMessage.sent_at,
            };

            // Send to recipient
            io.to(`user_${recipientId}`).emit("private_message", payload);

            // Echo back to sender for confirmation (optional)
            socket.emit("private_message", payload);
            
        } catch (err) {
            console.log("❌ Error in private_message:", err);
            socket.emit("error", { message: "Failed to send message!" });
        }
    });

    // Get chat history
    socket.on("get_chat_history", async ({ withUserId }) => {
        try {
            const messages = await Message.getChatHistory(userId, withUserId);
            socket.emit("chat_history", messages);
        } catch (err) {
            socket.emit("error", { message: "Failed to load chat history" });
        }
    });

    // Get conversation partners
    socket.on("get_conversations", async () => {
        try {
            const partners = await Message.getConversationPartners(userId);
            socket.emit("conversation_list", partners);
        } catch (err) {
            console.error("Error in 'get_conversations' handler:", err);
            socket.emit("error", { message: "Failed to load conversation partners" });
        }
    });
}

// function handleSocketEvents(io, socket){
//     const userId = socket.user.userId


//     //Join users private room
//     socket.join(`user_${userId}`)

//     //Send private message
//     socket.on("private_message", async({recipientId, message}) => {
//         try {

//             console.log("Received private_message:", { recipient_Id, message });
//             console.log("Sender user object from socket:", socket.user);

//             const savedMessage = await Message.create({
//                 sender_id: userId,
//                 recipient_id: recipientId,
//                 message: message,
//             });

//             console.log("Message saved:", savedMessage);

//             //emit to recipients room
//             io.to(`user_${recipientId}`).emit("private_message", {
//                 senderId: userId,
//                 message: savedMessage.message,
//                 timestamp: savedMessage.sent_at,
//             });

//             //emit back to sender
//             socket.emit("private_message", {
//                 senderId: userId,
//                 message: savedMessage.message,
//                 timestamp: savedMessage.sent_at,
//             });

//         } catch (err){
//             console.log("❌ Error in private_message:", err);
//             socket.emit("error", { message: "Failed to send message !"})
//         }

//         //Get private conversation between users
//         socket.on("get_chat_history", async({withUserId}) => {
//             try {
//                 const messages = await Message.getChatHistory(userId, withUserId)
//                 socket.emit("chat_history", messages)
//             } catch (err){
//                 socket.emit("error", { message: "Failed to load chat history"})
//             }
//         });

//         //Get list of users this person has messaged
//         socket.on("get_conversations", async () => {
//             try {
//                 const partners = await Message.getConversationPartners(userId)
//                 socket.emit("conversation_list", partners)

//             } catch(err){
//                 console.error("Error in 'private_message' handler:", err);
//                 socket.emit("error", { message: "Failed to load conversation partners"})
//             }
//         })
//     })
// }

module.exports = { handleSocketEvents }