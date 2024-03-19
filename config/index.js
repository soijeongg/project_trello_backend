import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import argon2 from 'argon2';
import { prisma } from '../src/utils/prisma/index.js';

// 사용자 정보를 세션에 저장
export default function passportConfig() {
passport.serializeUser((user, done) => {
  done(null, user.userId);
});
//세션을 검사해 사용자 식별 후 req.user에 저장함
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.User.findFirst({ where: { userId } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});


passport.use("local", new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    // 사용자 데이터베이스에서 이메일로 사용자 찾기
    const user = await prisma.User.findFirst({ where: { email: email } });
    if (!user) {
      return done(null, false, { message: '유저를 찾을 수 없습니다.' });
    }
    // 비밀번호 확인
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}))

}