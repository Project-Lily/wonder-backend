const express = require("express");
const router = express.Router();
const { wss, clientPool, clientRooms } = require("../service/websocket")
const _ = require("lodash")
const utils = require("./socket-util")


// Endpoint below should be used for browsers
// POST request should be sent after websocket connection is created
router.post("/join", function (req, res) {
    const id = req.body.id;
    if(!id in clientPool) return res.status(400).json({msg: "ID not found in client pool"});

    const teacherSocket = clientPool[id];
    const roomName = utils.getRoomName(req.ip);

    // Initializes the room
    clientRooms[roomName] = {
        "teacher" : teacherSocket,
        "student" : [],
        "questionList" : {}
    }
    
    teacherSocket.on("message", (data) => {
        // Handle browsers sending messages
        const jsonData = JSON.parse(data);
        const room = clientRooms[roomName];
        if(jsonData.eventName === "SEND_QUESTION") 
            teacherSendsQuestion(jsonData, room);
        else console.log("Unknown event name : ", jsonData.eventName);
    })
    
    console.log(`Room created at: ${roomName}`)
    return res.status(200).json({msg: "Room succesfully joined"});
});

function teacherSendsQuestion(jsonData, room) {
    room.questionList[jsonData.question] = jsonData.answer; 
    const students = room.student
    
    // Broadcast question to all students in room
    for(const student of students) {
        // Will be received by student.js, with event name RECEIVE_QUESTION
        student.send(JSON.stringify({ 
            "eventName" : "RECEIVE_QUESTION",
            "question" : jsonData.question
        }))
    }
}

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