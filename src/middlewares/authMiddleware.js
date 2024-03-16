import passport from 'passport';

export default function authMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.locals.user = req.user;

    return next();
  }
  res.clearCookie('connect.sid'); // 세션 쿠키 이름이 'connect.sid'인 경우. 실제 쿠키 이름에 맞게 변경하세요.
  return res.status(401).json({ message: '인증이 필요합니다.' });
}