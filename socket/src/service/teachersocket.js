const { getRoomName } = require("../endpoints/socket-util");
const { clientPool, clientRooms } = require("./globals");

function teacherListener(rname) {
    const roomName = rname;
    return (data, req) => {
        // Handle browsers sending messages
        const jsonData = JSON.parse(data);
        const room = clientRooms[roomName];
        if(jsonData.eventName === "SEND_QUESTION") 
            teacherSendsQuestion(jsonData, room);
        else console.log("Unknown event name : ", jsonData.eventName);
    }
}

function teacherSendsQuestion(jsonData, room) {
    if(!room.questionList) room.questionList = {};
    if(!room.student) room.student = [];

    room.questionList[jsonData.question] = jsonData.answer;
    const students = room.student
    
    // Broadcast question to all students in room
    for(const id of students) {
        const studentSocket = clientPool[id]
        
        // Will be received by student.js, with event name RECEIVE_QUESTION
        studentSocket.send(JSON.stringify({ 
            "eventName" : "RECEIVE_QUESTION",
            "question" : jsonData.question
        }))
    }
}

module.exports = { teacherListener }