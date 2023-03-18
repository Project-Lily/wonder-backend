const path = require("path");
const cors = require("cors");
const http = require("http");
const express = require("express");
const { initWs } = require("./service/websocket")

// Server stuff
const app = express();
const httpServer = http.createServer(app);
const wss = initWs(httpServer);
const api = require("./endpoints/api.js");

app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", api)

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log("Server listening on ", PORT)
});