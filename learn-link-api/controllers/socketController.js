const { Message } = require('../models/Message');
const { User } = require('../models/User')

function handleSocketEvents(io, socket) {
    const userId = socket.user.user_id;
    
    socket.join(`user_${userId}`);
    console.log("Joined room user_" + userId)

    // Send private message
    socket.on("private_message", async ({ recipientEmail, message }) => {
        if (!recipientEmail || !message) {
            console.log("⚠️ Missing recipient or message"); //ER
            socket.emit("error", { message: "Recipient or message missing" });
        return; 
        }

        try {
            console.log(`Private message from user ${userId} to ${recipientEmail}:`, message); //ER
            const recipient = await User.getOneByEmail(recipientEmail)
            if(!recipient){
                console.log("❌ Recipient not found");
                socket.emit("error", { message: "Recipient not found" })
                return;
            }

            const recipientId = recipient.user_id


            const savedMessage = await Message.create({
                sender_id: userId,
                recipient_id: recipientId,
                message,
            });

            const sender = await User.getUserById(userId)

            const payload = {
                senderId: userId,
                senderEmail: sender.email,
                recipientId,
                message: savedMessage.message,
                timestamp: savedMessage.sent_at,
            };

            // Send to recipient
            console.log("📤 Emitting to recipient room user_" + recipientId); //ER
            io.to(`user_${recipientId}`).emit("private_message", payload);
            

            // Echo back to sender for confirmation 
            console.log("📤 Echoing back to sender socket"); //ER
            socket.emit("private_message", payload);
            
            
        } catch (err) {
            console.error("❌ Error sending private message:", err);
            socket.emit("error", { message: "Failed to send message!" });
        }
    });

    // Get chat history
    socket.on("get_chat_history_by_email", async ({ email }) => {
        try {
            const recipient = await User.getOneByEmail(email);
            if (!recipient) {
                socket.emit("error", { message: "Recipient not found" });
                return;
            }

            console.log("✅ Recipient found:", recipient.user_id); //ER

            const withUserId = recipient.user_id;
            const messages = await Message.getChatHistory(userId, withUserId);

            const enrichedMessages = await Promise.all(messages.map(async msg => {
            const sender = await User.getUserById(msg.senderId);
            return { ...msg, senderEmail: sender.email };
            }));

            socket.emit("chat_history", enrichedMessages);
          
        } catch (err) {
            console.error("❌ get_chat_history_by_email error:", err); //ER
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

module.exports = { handleSocketEvents }