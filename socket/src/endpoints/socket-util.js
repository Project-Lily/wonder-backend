const crypto = require("crypto")

function closeSocket(socket) {
    socket.removeListener("message")
    socket.removeListener("connection")
    socket.close()
}

function getRoomName(ip) {
    return crypto.createHash('md5').update(ip).digest("hex").substring(0,5).toUpperCase();
}

module.exports = { closeSocket, getRoomName }