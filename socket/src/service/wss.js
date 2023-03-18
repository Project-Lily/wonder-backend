const ws = require("ws");
const { v4:uuidv4} = require('uuid');

let wss;
const clientPool = {}

function initWs(httpServer){
    wss = new ws.Server({ server: httpServer });
    wss.clientPool = {}

    wss.getUniqueId = () => {return uuidv4()}

    wss.on("error", console.error)
    wss.on("connection", (client) => {
        client.id = wss.getUniqueId();
        wss.clientPool[client.id] = client;
        console.log(wss.clientPool)
        
        client.on("message", (msg) => {
            client.send(`Your id is: ${client.id}`)
        })
        console.log("Client connected")
    })
    return wss
}


module.exports = {wss, initWs};