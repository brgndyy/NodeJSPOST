const express = require("express");
const path = require("path");
const { Post } = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/write.html"));
});

router.post("/", async (req, res) => {
  try {
    // 요청이 왔으면 무조건 응답을 해주어야함
    const todo = await Post.create({
      todo_content: req.body.todo_content,
      todo_date: req.body.todo_date,
    });

    // 모든 데이터 찾기
    const todolist = await Post.findAll();

    console.log("todolist : ", todolist);

    res.render("write.html", { todolist });
    console.log();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
