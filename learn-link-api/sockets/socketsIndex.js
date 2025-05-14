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
            console.log("SI Token: ", token);
            console.log(`Token: ${token}`);
            if (!token){
                console.log("No token provided");
                return next(new Error("No Token"))
            }


            const user = jwt.verify(token, process.env.SECRET_TOKEN)
            socket.user = user
            next()
        } catch(err) {
            console.log("❌ Auth error:", err.message);
            next(new Error("Authentication failed"))
        }
    });

    io.on("connection", (socket) => {
        handleSocketEvents(io, socket)
    });

    return io
}

module.exports = { initSocket }