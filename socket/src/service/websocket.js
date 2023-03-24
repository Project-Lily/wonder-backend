const ws = require("ws");
const { v4:uuidv4 } = require('uuid');
const { studentListener } = require("./studentsocket");
const { teacherListener } = require("./teachersocket");
const { clientPool, clientRooms } = require("./globals");

let wss;

function initWs(httpServer){
    wss = new ws.Server({ server: httpServer });
    wss.clientPool = {}

    wss.getUniqueId = () => { return uuidv4() }

    wss.on("error", console.error)
    wss.on("connection", (client, req) => {
        client.id = wss.getUniqueId();
        clientPool[client.id] = client;
        client.send(`${client.id}`);

        client.on("message", (data) => {
            const jsonData = JSON.parse(data)
            if(jsonData.eventName === "RECONNECT") {
                const oldId = jsonData.id;
    
                if(!(oldId in clientPool)) return;
                
                const oldSocket = clientPool[oldId];
                const roomName = oldSocket.roomName;
                const isStudent = oldSocket.isStudent ? true : false; 
    
                client.id = oldId;
                clientPool[oldId] = client;
                client.isStudent = isStudent;
                client.roomName = roomName
                
                if(isStudent) {
                    console.log("asdlfkj")
                    client.on("message", studentListener(roomName))
                } else {
                    client.on("message", teacherListener(roomName))
                };
            }
        })
    })

    return wss;
}


module.exports = {wss, initWs};