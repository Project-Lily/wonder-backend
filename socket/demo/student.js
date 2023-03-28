// Demo example for a teacher connection

createNewWs();

let id;
function createNewWs() {
    ws = new WebSocket("ws://localhost:3000")
    ws.onopen = (data) => {
        ws.onmessage = (data) => {
            console.log(`My id is : ${data.data}`)
            id = data.data;
            joinRoom(id)
        }
        console.log("Connected") 
    }
    
    ws.onclose = (data) => {
        console.log("Connection closed :c")
        if(id) {
            reconnect(id)
        } else {
            createNewWs()
        }
    }
}

function reconnect(oldId) {
    console.log("Attempting reconnection...")
    ws = new WebSocket("ws://localhost:3000")
    ws.onopen = (data) => {
        console.log("Reconnection successful")
        ws.send(JSON.stringify({
            "eventName" : "RECONNECT",
            "id" : oldId
        }))
        ws.onmessage = (data) => { console.log(data.data) }
    }
    ws.onclose = (data) => {
        console.log("Connection closed :c")
        reconnect(id)
    }
}

function joinRoom(data) {
    // MAKE SURE IT'S HTTPS, nginx is cursed
    fetch("http://localhost:3000/student/join", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            "id" : data,
            "name" : "herbabdo"
        })
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        ws.onmessage = (data) => { console.log(data.data) }
    });
}
