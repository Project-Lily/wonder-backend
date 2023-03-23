const express = require("express");
const router = express.Router();

const { clientPool, clientRooms } = require("../service/globals");
const { wss } = require("../service/websocket")
const _ = require("lodash")
const utils = require("./socket-util");
const { studentListener } = require("../service/studentsocket");


// Endpoint below should be used for braille devices
router.post("/join", function (req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const roomName = utils.getRoomName(req.ip);
    
    if(!(id in clientPool)) return res.status(400).json({msg : "ID not found in client pool"});
    if(!(roomName in clientRooms)) return res.status(400).json({msg: "Room not found in room list"});
    if(!(clientRooms[roomName].student)) clientRooms[roomName].student = []; 
    
    const studentSocket = clientPool[id];
    studentSocket.studentName = name;
    studentSocket.roomName = roomName;
    studentSocket.isStudent = true;
    
    clientRooms[roomName].student.push(id);
    studentSocket.on("message", studentListener(roomName))
    
    console.log(`A Student at ${req.ip} has joined room ${roomName}`)
    console.log(clientRooms)
    return res.status(200).json({msg: "Student succesfully joined room"});
});

router.post("/leave", function (req, res) {
    const id = req.body.id;
    const roomName = getRoomName(req.ip);

    if(!id in clientPool) return res.status(400).json({msg : "ID not found in client pool"});

    const socket = clientPool[id];

    socket.removeAllListeners()
    socket.close()
    
    const roomMembers = clientRooms[roomName].student;
    const index = roomMembers.indexOf(socket);
    roomMembers.splice(index, 1);

    clientPool.delete(id)

    return res.status(200).json({msg: "Succesfully deleted student"});
});

module.exports = router;