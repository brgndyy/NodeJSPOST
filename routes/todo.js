const express = require("express");
const path = require("path");
const { Post, User } = require("../models");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const todos = await Post.findAll({
      // get 같은경우는 params나 query 프로퍼티를 많이 사용
      where: { post_writer: req.params.id },
      order: [["todo_date", "ASC"]],
    });
    // res.sendFile(path.resolve(__dirname, "../views/write.html"));
    res.render("todo", { todoList: todos });
  } catch (err) {
    console.error(err);
  }
});

router.post("/write", async (req, res) => {
  try {
    // 요청이 왔으면 무조건 응답을 해주어야함
    // Post 테이블에 데이터 집어넣기
    const todo = await Post.create({
      todo_content: req.body.todo_content,
      todo_date: req.body.todo_date,
      post_writer: "1",
    });
    // 모든 데이터 찾기
    const todolist = await Post.findAll();

    console.log("todolist : ", todolist);

    // 여기서 데이터를 어떻게 전송??
    res.redirect("/todo/1");
  } catch (err) {
    console.error(err);
  }
});

router.post("/remove", async (req, res) => {
  try {
    const removeTodo = await Post.destroy({
      where: { id: req.body.id },
    });

    res.json({ msg: "ok", chk: removeTodo });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
