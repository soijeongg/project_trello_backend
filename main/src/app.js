import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import passportConfig from '../config/index.js';
import LogMiddleware from './middlewares/logMiddleware.js';
import notFoundErrorHandler from './middlewares/notFoundErrorMiddleware.js';
import generalErrorHandler from './middlewares/generalErrorMiddleware.js';
import router from './routes/index.js';
import { createServer } from 'http';
import { createClient } from 'redis';
import session from 'express-session';
import RedisStore from 'connect-redis';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: `${process.env.REDIS_PASSWORD}`,
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
    origin: true, // 허용할 도메인 목록
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // url-encoded 형식의 데이터를 파싱할 수 있도록 미들웨어를 추가. extended: false 옵션은 Node.js의 기본 쿼리 문자열 파서를 사용하여 URL-encoded 데이터를 파싱
app.get('/', (req, res) => {
  res.send('<h1>Trello!!!</h1>');
});

// Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use('/api', router);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
