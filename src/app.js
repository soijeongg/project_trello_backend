import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import expressMySQLSession from 'express-mysql-session';
import passport from 'passport';
import cors from 'cors';
import { prisma } from '../src/utils/prisma/index.js';
import LogMiddleware from './middlewares/logMiddleware.js';
import notFoundErrorHandler from './middlewares/notFoundErrorMiddleware.js';
import generalErrorHandler from './middlewares/generalErrorMiddleware.js';
import router from './routes/index.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import sharedsession from 'express-socket.io-session';


dotenv.config();

const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer);
const io = new Server(httpServer, {
  cors: {
    origin: true, // 프론트엔드 서버 주소
    methods: ['GET', 'POST'], // 허용할 HTTP 메소드
    credentials: true, // 쿠키를 포함한 요청을 허용
  },
});

const PORT = process.env.PORT;

const MySQLStore = expressMySQLSession(expressSession); // express-session 미들웨어가 세션 정보를 메모리에 저장하는 대신, express-mysql-session을 사용해 MySQL 데이터베이스에 세션 정보를 저장
const sessionStore = new MySQLStore({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  expiration: 1000 * 60 * 60 * 24,
  createDatabaseTable: true,
});

const sessionMiddleware = expressSession({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});

// Express 앱에 세션 미들웨어 적용
app.use(sessionMiddleware);

app.use(LogMiddleware);
app.use(
  cors({
    origin: true, // 프론트엔드 서버 주소
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);
// app.use(
//   cors(
//   //   {
//   //   origin: true, // 요청이 온 도메인을 허용
//   //   credentials: true, // 쿠키를 포함한 요청을 허용
//   // }
//   )
// );
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // url-encoded 형식의 데이터를 파싱할 수 있도록 미들웨어를 추가. extended: false 옵션은 Node.js의 기본 쿼리 문자열 파서를 사용하여 URL-encoded 데이터를 파싱
app.get('/', (req, res) => {
  res.send('<h1>Trello</h1>');
});

// Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());
import '../config/passport.js';

app.use('/api', router);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

io.use(
  sharedsession(sessionMiddleware, {
    autoSave: true,
  })
);

io.on('connection', async (socket) => {
  // async 키워드 추가
  console.log('연결 성공!');
  const userId = socket.handshake.session.passport?.user; // Optional Chaining 사용

  let userNickname = '익명'; // 기본값 설정

  if (userId) {
    try {
      const user = await prisma.user.findFirst({ where: { userId: +userId } }); // await 키워드 추가, findFirst -> findUnique 변경
      userNickname = user?.nickname ?? '익명'; // user가 null이거나 nickname이 undefined일 경우를 대비한 처리
    } catch (error) {
      console.error('사용자 정보 조회 중 오류 발생:', error);
    }
  }

  // 클라이언트로부터 채팅 메시지를 받았을 때
  socket.on('chat message', (msg) => {
    // 이제 userNickname 변수는 채팅 메시지 이벤트 핸들러에서도 접근 가능
    // console.log(`${userNickname}: ${msg.text}`);

    io.emit('chat message', { msg: msg.text, user: userNickname, own: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
