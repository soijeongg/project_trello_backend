// temp_login.js
export default function tempLogin(req, res, next) {
  // 임시 유저 정보 설정
  res.locals.user = {
    userId: 1, // 예시 ID
    email: 'user@example.com', // 예시 이메일
    // 필요한 추가 정보
  };
  next();
}
