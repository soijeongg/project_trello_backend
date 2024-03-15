import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import expressMySQLSession from 'express-mysql-session';
import LogMiddleware from './middlewares/logMiddleware.js';
import notFoundErrorHandler from './middlewares/notFoundErrorMiddleware.js';
import generalErrorHandler from './middlewares/generalErrorMiddleware.js';
import router from './routes/index.js';
dotenv.config();

const app = express(); // Express 애플리케이션 인스턴스를 생성하는 부분입니다. express() 함수를 호출함으로써, Express 앱이 시작되고 이 인스턴스를 사용해 라우팅, 미들웨어 등을 설정합니다.
const PORT = process.env.PORT;

// 사용자 정보를 세션에 저장
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.User.findFirst({ where: { userId } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const MySQLStore = expressMySQLSession(expressSession); // express-session 미들웨어가 세션 정보를 메모리에 저장하는 대신, express-mysql-session을 사용해 MySQL 데이터베이스에 세션 정보를 저장
const sessionStore = new MySQLStore({
  // 저장할 mysql 정보를 설정. 즉, express-mysql-session에 저장할 정보를 설정
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  expiration: 1000 * 60 * 60 * 24,
  createDatabaseTable: true,
});

app.use(
  // 세션 정보의 활용 방식을 설정. 즉, express-session의 정보를 경우마다 어떻게 쓸건지 설정하는 것.
  expressSession({
    secret: process.env.JWT_SECRET, // 세션을 암호화하는 비밀 키를 설정
    resave: false, // 클라이언트의 요청이 올 때마다 세션을 새롭게 저장할 지 설정, 변경사항이 없어도 다시 저장
    saveUninitialized: false,
    store: sessionStore, // 세션이 초기화되지 않았을 때 세션을 저장할 지 설정
    cookie: {
      // 세션 쿠키 설정
      maxAge: 1000 * 60 * 60 * 24, // 쿠키의 만료 기간을 1일로 설정합니다.
    },
  })
);

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // url-encoded 형식의 데이터를 파싱할 수 있도록 미들웨어를 추가. extended: false 옵션은 Node.js의 기본 쿼리 문자열 파서를 사용하여 URL-encoded 데이터를 파싱
app.get('/', (req, res) => {
  res.send('<h1>trello</h1>');
});

app.use(passport.initialize());
app.use(passport.session());
import '../config/passport.js';

app.use('/api', router);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
