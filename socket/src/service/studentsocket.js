const { clientPool, clientRooms } = require("./globals");

function studentListener(rname) {
    const roomName = rname;
    return (data, req) => {
        // Handle devices sending messages
        const jsonData = JSON.parse(data);
        const room = clientRooms[roomName];
    
        if(jsonData.eventName === "SEND_ANSWER")
            studentSendsAnswer(jsonData, room, studentSocket)
        else console.log("Unknown event name : ", jsonData.eventName);
    }
}

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
module.exports = { studentListener }