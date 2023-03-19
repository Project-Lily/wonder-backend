// Demo example for a teacher connection
ws = new WebSocket("ws://localhost:3000")
ws.onopen = (data) => {
    ws.onmessage = (data) =>{
        console.log(`My id is : ${data.data}`)
        // Creates room and destroys own listener, this is so that this listener doesn't mess with future events
        createRoom(data.data)
    }
    console.log("Connected") 
}

function createRoom(data) {
    fetch("http://localhost:3000/teacher/join", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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
