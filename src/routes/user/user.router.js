import express from 'express';
import passport from 'passport';
import { prisma } from '../../utils/prisma/index.js';
import { userController } from './user.controller.js';
import { userService } from './user.service.js';
import {  userRespository } from './user.repository.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

let router = express.Router();

const UserRespository = new userRespository(prisma);
const UserService = new userService(UserRespository);
const UserController = new userController(UserService);

router.post('/sign-up', UserController.postSignUpcontroller);
router.post('/idCheck', UserController.idCheckController);
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info });
      }
      req.login(user, async (err) => {
        if (err) {
          return next(err);
        }
        req.user = user
        res.locals.user = user;
        

        return res.json({ message: `${user.nickname}님 환영합니다!~` });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});
router.get('/user/get', authMiddleware, UserController.getLoginController);
router.put('/user', authMiddleware, UserController.putLoginController);
router.delete('/user', authMiddleware, UserController.deleteController);
router.delete('/logout', authMiddleware, (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({ message: '로그아웃' });
  });
});

export default router;
