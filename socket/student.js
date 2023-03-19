// Demo example for a teacher connection
ws = new WebSocket("wss://lilly.arichernando.com/socket")
ws.onopen = (data) => {
    ws.onmessage = (data) => {
        console.log(`My id is : ${data.data}`)
        joinRoom(data.data)
    }
    console.log("Connected") 
}

function joinRoom(data) {
    // MAKE SURE IT'S HTTPS, nginx is cursed
    fetch("https://lilly.arichernando.com/node/student/join", {
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
