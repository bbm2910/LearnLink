const { Message } = require('../models/Message');
const { User } = require('../models/User')

function handleSocketEvents(io, socket) {
    const userId = socket.user.user_id;
    
    socket.join(`user_${userId}`);

    // Send private message
    socket.on("private_message", async ({ recipientEmail, message }) => {

       

        if (!recipientEmail || !message) {
            socket.emit("error", { message: "Recipient or message missing" });
        return; 
        }


        try {

            const recipient = await User.getOneUserByEmail(recipientEmail)
            if(!recipient){
                socket.emit("error", { message: "Recipient not found" })
            }

            const recipientId = recipient.user_id


            const savedMessage = await Message.create({
                sender_id: userId,
                recipient_id: recipientId,
                message,
            });

            const sender = await User.getOneById(userId)

            const payload = {
                senderId: userId,
                senderEmail: sender.email,
                recipientId,
                message: savedMessage.message,
                timestamp: savedMessage.sent_at,
            };

            // Send to recipient
            io.to(`user_${recipientId}`).emit("private_message", payload);

            // Echo back to sender for confirmation (optional)
            socket.emit("private_message", payload);
            
        } catch (err) {
            socket.emit("error", { message: "Failed to send message!" });
        }
    });

    // Get chat history
    socket.on("get_chat_history_by_email", async ({ email }) => {
        try {
            const recipient = await User.getOneUserByEmail(email);
            if (!recipient) {
                socket.emit("error", { message: "Recipient not found" });
                return;
            }

            const withUserId = recipient.user_id;
            const messages = await Message.getChatHistory(userId, withUserId);

            const enrichedMessages = await Promise.all(messages.map(async msg => {
            const sender = await User.getOneById(msg.senderId);
            return { ...msg, senderEmail: sender.email };
            }));

            // socket.emit("chat_history", messages);
            socket.emit("chat_history", enrichedMessages);
          
        } catch (err) {
            console.error("❌ get_chat_history_by_email error:", err);
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