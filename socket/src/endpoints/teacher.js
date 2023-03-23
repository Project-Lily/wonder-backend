const express = require("express");
const router = express.Router();

const { clientPool, clientRooms } = require("../service/globals");
const { wss } = require("../service/websocket")
const _ = require("lodash")
const utils = require("./socket-util");
const { teacherListener } = require("../service/teachersocket");

// Endpoint below should be used for browsers
// POST request should be sent after websocket connection is created
router.post("/join", function (req, res) {
    const id = req.body.id;
    const roomName = utils.getRoomName(req.ip);
    if(!(id in clientPool)) return res.status(400).json({msg: "ID not found in client pool"});
    if(!(roomName in clientRooms)) clientRooms[roomName] = {}; 

    const teacherSocket = clientPool[id];
    teacherSocket.isStudent = false;
    teacherSocket.roomName = roomName;
    
    // Initializes the room
    clientRooms[roomName].teacher = teacherSocket;
    
    teacherSocket.on("message", teacherListener(roomName))
    
    console.log(`Teacher at ${req.ip} has joined room ${roomName}`)
    console.log(clientRooms)
    return res.status(200).json({msg: "Room succesfully joined"});
});

router.post("/leave", function (req, res) {
    const id = req.body.id;
    const roomName = utils.getRoomName(req.ip);

    if(!id in clientPool) return res.status(400).json({msg: "ID not found in client pool"});

    const socket = clientPool[id];
    const room = clientRooms[roomName];
    const roomMembers = room.student;

    // Close all students connection
    for(const i of roomMembers) utils.closeSocket(i);

    clientPool.delete(id)
    utils.closeSocket(socket)
    
    delete room;

    res.status(200).json({msg: "Succesfully deleted student and room"});
});


module.exports = router;