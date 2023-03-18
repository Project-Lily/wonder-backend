const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { wss } = require("../service/wss")

router.get("/", function (req, res) {
    console.log(req.socket.remoteAddress);
    return req.ip;
});

module.exports = router;