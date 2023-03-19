// Demo example for a teacher connection
ws = new WebSocket("wss://lilly.arichernando.com/socket/")
ws.onopen = (data) => {
    ws.onmessage = (data) =>{
        console.log(`My id is : ${data.data}`)
        joinRoom(data.data)
    }
    console.log("Connected") 
}

function joinRoom(data) {
    fetch("http://localhost:3000/student/join", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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
