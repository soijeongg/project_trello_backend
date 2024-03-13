import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { userController } from './user.controller.js';
import { userService } from './user.service.js';
import {  userRespository } from './user.repository.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

let router = express.Router()

const UserRespository = new userRespository(prisma)
const UserService = new userService(UserRespository)
const UserController = new userController(UserService)

router.post('/sign-up', UserController.postSignUpcontroller);
router.post('/idCheck', UserController.idCheckController);
router.post('/login', UserController.loginController);
router.put('/user', authMiddleware, UserController.putLoginController);
router.delete('/user', authMiddleware, UserController.deleteController);
router.delete('/logout', authMiddleware, UserController.logoutController);

export default router