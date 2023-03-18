const path = require("path");
const http = require("http");
const express = require("express");
const { initWs } = require("./service/wss")

// Server stuff
const app = express();
const httpServer = http.createServer(app);
const wss = initWs(httpServer);
const api = require("./endpoints/api.js");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", api)


const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log("server listening on ", PORT)
});
