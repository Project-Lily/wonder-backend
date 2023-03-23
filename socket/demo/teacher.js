// Demo example for a teacher connection
ws = new WebSocket("wss://lilly.arichernando.com")
ws.onopen = (data) => {
    ws.onmessage = (data) =>{
        console.log(`My id is : ${data.data}`)
        // Creates room and destroys own listener, this is so that this listener doesn't mess with future events
        createRoom(data.data)
    }
    console.log("Connected")
}

function createRoom(data) {
    // MAKE SURE IT'S HTTPS, nginx is cursed
    fetch("https://lilly.arichernando.com/teacher/join/", {
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