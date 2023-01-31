const express = require("express");
const passport = require("passport");
const path = require("path");
const User = require("../models/user");
const router = express.Router();
// 로그인을 직접 처리할 때 사용하는 모듈
const LocalStrategy = require("passport-local").Strategy;

router.get("/", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "../views/login.html"));
  try {
    res.render("login.html");
  } catch (error) {
    console.error(error);
  }
});

// /login 이 메인라우터이고 이 안에서 /add이므로 form 태그 내에서 /login/add를 해주어야함.
router.post(
  "/",
  // passport.authenticate()를 Local Strategy로 호출함.
  passport.authenticate("local", { failureRedirect: "/write" }),
  async (req, res) => {
    res.send("로그인 완료");
  }
);

passport.use(
  new LocalStrategy(
    {
      // 로그인 후 세션으로 저장할것인지 설정하는 칸
      usernameField: "userId", // login.html form에 있는 input 태그의 name속성에 작성된 속성명과 같이
      passwordField: "userPassword", // login.html form에 있는 input 태그의 name속성에 작성된 속성명과 같이
      session: true, // 세션을 만들어줄 것인가?
      passReqToCallback: false, // 사용자 아이디와 비밀번호 말고도 다른 정보를 검사해야하는가?
    },
    async (id, password, done) => {
      try {
        const exUser = await User.findOne({ where: { id } });
        if (exUser) {
          done(null, exUser);
        } else {
          done(null, false, { message: "존재하지 않는 아이디입니다." });
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

// 로그인 시에 실행되며, req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드
// 사용자 정보가 들어가 있다고 생각하면됨.
// done의 첫번째 인자 null은 에러 발생 시 사용함, 두번째 인자는 저장하고 싶은 데이터를 넣음
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 매 요청시에 실행됨. passport.session 미들웨어가 이 메서드를 호출함.
// serializeUser에서 넣었던 user.id 가 deserializeUser의 매개변수 id로 들어감
passport.deserializeUser((id, done) => {
  User.findOne({ where: { id } })
    .then((user) => done(null, user)) // user는 req.user에 저장된다.
    .catch((err) => done(err));
});

module.exports = router;
