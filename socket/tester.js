ws = new WebSocket("ws://localhost:3000")
ws.onopen = (data) => {
    ws.onmessage = (data) =>{
        console.log(`My id is : ${data.data}`)
        createRoom(data.data)
    }
    console.log("Connected") 
}

function createRoom(data) {
    fetch("http://localhost:3000/sender", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id" : data 
        })
    })
}
