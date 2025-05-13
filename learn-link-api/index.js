require("dotenv").config();
const { app } = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

const port = process.env.PORT;

//Store socket connections mapped by user ID
const userSockets = new Map() 

//Authenticate socket connection using JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  try {
    const payload = jwt.verify(token, process.env.SECRET_TOKEN)
    socket.user = payload
    next()
  } catch (err) {
    next(new Error("Authentication failed"))
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.user_id
  console.log(`User ${userId} has connected!`);
  userSockets.set(userId, socket.id)

  socket.on("private_message", async ({recipient_Id, message}) => {
    const recipientSockedId = userSockets.get(recipient_Id)
    if(recipientSockedId) {
      io.to(recipientSockedId).emit("private_message", {
        senderId: userId,
        message,
      })
    }
  })

  socket.on("disconnect", () => {
    console.log(`User ${userId} has disconnected!`);
    userSockets.delete(userId)
  })
})



app.listen(port, () => {
  console.log(`API running on port: ${port}`);
});
