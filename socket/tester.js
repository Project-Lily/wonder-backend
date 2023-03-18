ws = new WebSocket("ws://localhost:3000")
ws.onopen = (data) => {
    console.log("connected")
    ws.send("heyheyhey")
}
ws.onmessage = (data) =>{
    console.log(data)
}