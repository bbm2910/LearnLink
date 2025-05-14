const { Message } = require('../models/Message');
const { User } = require('../models/User')

function handleSocketEvents(io, socket) {
    const userId = socket.user.user_id;
    console.log(`Controller userID: ${userId}`);
    socket.join(`user_${userId}`);

    // Send private message
    socket.on("private_message", async ({ recipientEmail, message }) => {

        console.log("📨 Received private_message:", { recipientEmail, message });

        if (!recipientEmail || !message) {
            console.log("userId: ", userId);
            console.log("⚠️ Missing recipientId or message");
            socket.emit("error", { message: "Recipient or message missing" });
        return; //err log
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

            console.log("✅ Message saved to DB:", savedMessage);

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
            console.log("❌ Error in private_message:", err);
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
            console.log(`Socket; userId: ${userId} withUserId: ${withUserId}`);
            socket.emit("chat_history", messages);
            console.log('messages: ', messages);
            // const messages = await Message.getChatHistory(userId, withUserId);
            // socket.emit("chat_history", messages);
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