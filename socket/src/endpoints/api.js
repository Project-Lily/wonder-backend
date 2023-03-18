const express = require("express");
const router = express.Router();
const crypto = require("crypto")
const { wss, clientPool, clientRooms } = require("../service/websocket")

// Endpoint below should be used for browsers
// POST request should be sent after websocket connection is created
router.post("/sender", function (req, res) {
    const id = req.body.id;
    if(!id in clientPool) return "ID not found in client pool";

    const socket = clientPool[id];
    const roomName = getRoomName(req.ip);

    // Initializes the room
    clientRooms[roomName] = { 
        "sender" : socket,
        "receiver" : []
    }

    socket.on("message", (data) => {
        const jsonData = JSON.parse(data);
        if(jsonData.eventName);
    })

    return req.ip;
});

// Endpoint below should be used for braille devices
router.post("/receiver", function (req, res) {
    const id = req.body.id;
    const room = getRoomName(req.ip);
    
    if(!id in clientPool) return "ID not found in client pool";
    if(!room in clientRooms) return "Room not found in room list";

    const socket = clientPool[id];

    clientRooms[roomName].receiver.push(socket);
    socket.on("message", (data) => {
        const jsonData = JSON.parse(data);
        console.log(jsonData)
    })

    return req.ip;
});

router.post("/leave", function (req, res) {
    const id = req.body.id;
    if(!id in clientPool) return;

    const socket = clientPool[req.body.id];
    socket.removeAllListeners()
    return req.ip;
});

function getRoomName(ip) {
    return crypto.createHash('md5').update(ip).digest("hex").substring(0,5).toUpperCase();
}
module.exports = router;