import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export function generateRandomPassword() {
  return crypto.randomBytes(20).toString('hex');
}

const transporter = nodemailer.createTransport({
  service: 'naver',
  host: 'smtp.naver.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const sendVerificationEmail = (userEmail, verificationToken) => {
  const mailOptions = {
    from: `${process.env.USER}@naver.com`,
    to: userEmail,
    subject: '트렐로 회원가입 인증 이메일입니다',
    html: `<p>아래의 링크를 클릭하여 회원가입을 완료하세요.</p>
           <p><a href="https://api.nodejstrello.site/api/verify?token=${verificationToken}">회원가입 인증하기</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`인증 이메일 발송: ${info.response}`);
    }
  });
};
