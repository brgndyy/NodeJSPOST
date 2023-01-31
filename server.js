// express 사용
const express = require("express");

// 각 요청과 응답에 대한 정보들을 콘솔에 기록
const morgan = require("morgan");

// 쿠키를 해석해서 req.cookies 객체로 만듬
const cookieParser = require("cookie-parser");

// 세션 관리용 미들웨어, req.session 객체 안에 유지됨.
const session = require("express-session");

//.env 파일을 읽어서 process.env 로 만들어주는 역할
const dotenv = require("dotenv");

//이미지 업로드 미들웨어
const multer = require("multer");

// 넌적스 사용
const nunjucks = require("nunjucks");

//models/index.js 안에 있는 sequelize 객체 가져오기
const { sequelize } = require("./models");

//모델 불러오기
const { User } = require("./models");

// 회원가입과 로그인 처리 해주는 모듈
const passport = require("passport");

//라우터 불러오가
const mainRouter = require("./routes/index.js");
const todoRouter = require("./routes/todo.js");
const loginRouter = require("./routes/login.js");

dotenv.config();
const app = express();

//시퀄라이즈 동기화, force가 true라면 서버 실행시마다 테이블을 재생성함
// 테이블을 잘못 만들었다면 true로 설정하면 됨
// alter 속성도 있는데, alter 속성이 true라면 데이터베이스 안에 있는
// 현재 상태들을 확인한 후, 모델과 일치하도록 테이블을 변경해줌.
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터 베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// 넌적스 설정
nunjucks.configure("views", {
  // views 폴더 경로 설정
  express: app, // express와 연동
  watch: true, // html파일이 변경될때 템플릿 엔진 재렌더링
});

// 이미지 업로드 옵션 설정
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      // 어디에 이미지들을 저장할것인가?
      // req는 요청, file은 업로드하는 파일
      done(null, "uploads/"); // req나 file을 가공해서 done으로 넘김
    },
    filename(req, file, done) {
      // 저장할 파일 이름
      const ext = path.extname(file.originalname); // 파일명 그대로 저장함
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

//port라는 변수를 설정하는데, 기존 포트가 있다면 기존 포트를 사용하고 없으면 3000번 사용
app.set("port", process.env.PORT || 3000);

// html로 view engine 셋팅
app.set("view engine", "html");

//

// 요청, 응답 기록 정보 남기기
app.use(morgan("dev"));

// 쿠키를 해석해서 req.cookies 객체로 만들어줌. 쿠키를 생성, 제거 하고싶다면
// res.cookie, res.clearCookie 메서드를 사용
app.use(cookieParser(process.env.COOKIE_SECRET));

// body-parser 사용
// json형태의 데이터를 해석해준다.
app.use(express.json());
// 주소형태의 데이터를 해석해준다. extended 가 false라면 노드의 querystring모듈을,
// true라면 qs 모듈을 사용하여 쿼리스트링을 해석한다.(querystring 모듈을 좀 더 확장한것)
app.use(express.urlencoded({ extended: false }));

// 세션 생성
app.use(
  session({
    resave: false, // 세션에 수정사항이 생기지 않더라도 세션을 다시 저장하겠는가?
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성하겠는가?
    secret: process.env.COOKIE_SECRET, //클라이언트에 쿠키를 보낼때 쿠키에 서명을 하기 위한 값
    cookie: {
      httpOnly: true, // true일때 자바스크립트에서 쿠키 접근 불가능,
      // 쿠키 조작을 방지하기 위해 설정하는것이 좋음
      secure: false, // https 일때만 쿠키 전송
    },
    name: "session-cookie", // 세션 쿠키의 이름
  })
);

app.use(passport.initialize()); //요청(req)에 passport 설정을 심고
app.use(passport.session()); // req.sessiong 객체에 passport 정보를 저장한다.
// passport 미들웨어 설정, session에서 생성된 req.session 객체에 passport 정보를 저장하는 것이므로
// passport 미들웨어는 express-session 미들웨어보다 밑에 작성 되어야함.
// passport.session()이 시행되면, 세션 쿠키 정보를 바탕으로 해서 deserializeUser()가 실행된다.

//라우터 사용
app.use("/", mainRouter);
app.use("/todo", todoRouter);
app.use("/login", loginRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
