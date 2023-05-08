
// Demo example for a teacher connection
createNewWs()

function createNewWs() {
    ws = new WebSocket("ws://localhost/socket")
    ws.onopen = (data) => {
        ws.onmessage = (data) =>{
            console.log(`My id is : ${data.data}`)
            // Creates room and destroys own listener, this is so that this listener doesn't mess with future events
            createRoom(data.data)
        }
        console.log("Connected")
    }

    ws.onclose = (data) => {
        console.log("Connection closed :c")
        createNewWs()
    }
}


function createRoom(data) {
    // MAKE SURE IT'S HTTPS, nginx is cursed
    fetch("http://localhost:3000/teacher/join/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            "id" : data 
        })
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        ws.onmessage = (data) => { console.log(data.data) }
    });
}

// ws.send(JSON.stringify({
//     "eventName" : "SEND_QUESTION",
//     "question" : "whatever",
//     "answer" : "the right answer"
// }))