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
            if(jsonData !== "RECONNECT") return;
            
            const oldId = jsonData.id;

            const oldSocket =  clientPool[oldId]; 
            const isStudent = oldSocket.isStudent; 

            client.id = oldId;
            clientPool[oldId] = client;
            
            console.log(clientRooms)

            if(isStudent) client.on("message", studentListener);             
            else client.on("message", teacherListener);
        })
    })

    return wss;
}


module.exports = {wss, initWs};