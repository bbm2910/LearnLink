require("dotenv").config();
const { app } = require("./app");
const http = require("http");
const { initSocket } = require("./sockets/socketsIndex");



const server = http.createServer(app);
const io = initSocket(server)

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Socket running on port : ${port}`);
})

