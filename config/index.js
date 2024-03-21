import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import argon2 from 'argon2';
import { prisma } from '../src/utils/prisma/index.js';
import crypto from 'crypto';

function generateRandomPassword() {
  return crypto.randomBytes(16).toString('hex');
}

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

  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
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
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'https://api.nodejstrello.site/api/auth/google/callback', // 구글 로그인 Redirect URI 경로
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await prisma.User.findFirst({
            where: { email: profile.emails[0].value, provider: 'google' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await prisma.User.create({
              data: {
                email: profile.emails[0].value,
                password: generateRandomPassword(), // 가상의 비밀번호 할당
                nickname: profile.displayName,
                provider: 'google', // 사용자가 Google을 통해 인증되었음을 나타내는 필드 추가
                isVerified: true,
              },
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
}
