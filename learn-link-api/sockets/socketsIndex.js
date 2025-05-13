const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")
const { handleSocketEvents } = require("../controllers/socketController")

function initSocket(server){
    const io = new Server(server, {
        cors: {
            origin: "http://127.0.0.1:5500",
            methods: ["GET", "POST"],
        }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token
            const user = jwt.verify(token, process.env.SECRET_TOKEN)
            socket.user = user
            next()
        } catch(err) {
            next(new Error("Authentication failed"))
        }
    });

    io.on("connection", (socket) => {
        handleSocketEvents(io, socket)
    });

    return io
}

module.exports = { initSocket }