import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import passportConfig from '../config/index.js';
import { prisma } from '../src/utils/prisma/index.js';
import LogMiddleware from './middlewares/logMiddleware.js';
import notFoundErrorHandler from './middlewares/notFoundErrorMiddleware.js';
import generalErrorHandler from './middlewares/generalErrorMiddleware.js';
import router from './routes/index.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import sharedsession from 'express-socket.io-session';
import { createClient } from 'redis';
import session from 'express-session';
import RedisStore from 'connect-redis';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

await redisClient.connect();
console.log('Redis 서버에 연결되었습니다.');

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});

app.use(sessionMiddleware);

app.use(LogMiddleware);
app.use(
  cors({
    origin: true, // 프론트엔드 서버 주소
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // url-encoded 형식의 데이터를 파싱할 수 있도록 미들웨어를 추가. extended: false 옵션은 Node.js의 기본 쿼리 문자열 파서를 사용하여 URL-encoded 데이터를 파싱
app.get('/', (req, res) => {
  res.send('<h1>Trello</h1>');
});

// Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use('/api', router);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

const PORT = Number(process.env.PORT) || 3000;

httpServer.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});

io.use(
  sharedsession(sessionMiddleware, {
    autoSave: true,
  })
);

io.on('connection', async (socket) => {
  console.log('연결 성공!');
  const userId = socket.handshake.session.passport?.user;
  let userNickname = '익명';
  let currentRoom = '';

  if (userId) {
    try {
      const user = await prisma.user.findUnique({ where: { userId: +userId } });
      userNickname = user?.nickname ?? '익명';
    } catch (error) {
      console.error('사용자 정보 조회 중 오류 발생:', error);
    }
  }

  // 전체 채팅에 입장
  socket.join('main');

  // 방 입장 처리
  socket.on('join room', (roomName) => {
    if (currentRoom) {
      socket.leave(currentRoom); // 이전 방에서 나감
    }
    socket.join(roomName); // 새로운 방에 입장
    currentRoom = roomName;
    console.log(`${userNickname} entered ${roomName}`);
  });

  // 방 나가기 처리
  socket.on('leave room', () => {
    if (currentRoom) {
      socket.leave(currentRoom); // 현재 방에서 나감
      console.log(`${userNickname} left ${currentRoom}`);
    }
    socket.join('main'); // 기본 방으로 돌아감
    currentRoom = 'main';
  });

  // 채팅 메시지 처리
  socket.on('chat message', (msg) => {
    const roomToEmit = currentRoom || 'main'; // 현재 방이 없으면 기본 방으로 설정
    io.to(roomToEmit).emit('chat message', { msg: msg.text, user: userNickname, own: socket.id });
    console.log(`Message in ${roomToEmit}: ${msg.text}`);
  });

  // 사용자 연결 해제 처리
  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (currentRoom) {
      socket.leave(currentRoom); // 연결 해제 시 현재 방에서 나감
    }
  });
});