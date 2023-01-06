const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/login.html"));
});

// /login 이 메인라우터이고 이 안에서 /add이므로 form 태그 내에서 /login/add를 해주어야함.
router.post("/add", (req, res) => {
  console.log(req.body);
  res.send("전송 완료");
});

module.exports = router;
