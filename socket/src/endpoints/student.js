const express = require("express");
const router = express.Router();
const { wss, clientPool, clientRooms } = require("../service/websocket")
const _ = require("lodash")
const utils = require("./socket-util")


// Endpoint below should be used for braille devices
router.post("/join", function (req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const roomName = utils.getRoomName(req.ip);
    
    if(!(id in clientPool)) return res.status(400).json({msg : "ID not found in client pool"});
    if(!(roomName in clientRooms)) return res.status(400).json({msg: "Room not found in room list"});
    
    const studentSocket = clientPool[id];
    studentSocket.studentName = name;
    
    clientRooms[roomName].student.push(studentSocket);
    studentSocket.on("message", (data) => {
        // Handle devices sending messages
        const jsonData = JSON.parse(data);
        const room = clientRooms[roomName];

        if(jsonData.eventName === "RECEIVE_QUESTION") 
            // This is handled by frontend
            console.log("Student have received question")
        else if(jsonData.eventName === "SEND_ANSWER")
            studentSendsAnswer(jsonData, room, studentSocket)
        console.log(jsonData)
    })
    
    return res.status(200).json({msg: "Student succesfully joined room"});
});


function studentSendsAnswer(jsonData, room, studentSocket) {
    const teacherSocket = room.teacher;
    const question = jsonData.question;
    const questionList = room.questionList;

    // Evaluates question, sends it to frontend
    teacherSocket.send(JSON.stringify({
        "eventName" : "RECEIVE_EVALUATION",
        "name" : studentSocket.studentName,
        "evaluation" : (questionList[question] === jsonData.answer)
    }))
}

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