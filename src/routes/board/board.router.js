import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { BoardRepository } from './board.repository.js';
import { BoardService } from './board.service.js';
import { BoardController } from './board.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
const boardRepository = new BoardRepository(prisma);
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService);

const router = express.Router();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: 'ap-northeast-2',
});
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nodejstrello',
    key: function (req, file, cb) {
      // 파일의 원본 이름에서 확장자를 추출합니다.
      const extension = path.extname(file.originalname);
      // 파일 이름을 타임스탬프, 난수, 확장자를 조합하여 생성합니다.
      // 난수를 생성하여 파일 이름에 추가합니다.
      const randomPart = Math.random().toString(36).substring(2, 15); // 36진수로 변환 후 2에서 15까지의 문자열을 잘라냅니다.
      cb(null, `original/${Date.now()}-${randomPart}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 사이즈 제한
});
router.post('/joinPage', authMiddleware, boardController.joinBoard); //authMiddleware,
router.get('/', authMiddleware, boardController.getBoards); //authMiddleware,
router.get('/:boardId', authMiddleware, boardController.getBoardsId); //authMiddleware,
router.post('/', authMiddleware, upload.single('boardThumbnail'), boardController.createBoard); //authMiddleware,
router.put('/:boardId', authMiddleware, boardController.updateBoard); //authMiddleware,
router.delete('/:boardId', authMiddleware, boardController.deleteBoard); //authMiddleware,
//user>UserBoard 접근
router.get('/userBoard', authMiddleware, boardController.findUserBoard);
//board>UserBoard 접근
router.get('/:boardId/userBoard', authMiddleware, boardController.findUserBoard2);

export default router;
