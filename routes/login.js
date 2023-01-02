const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/login.html"));
});

router.post("/add", (req, res) => {
  res.send("전송 완료");
});

module.exports = router;
