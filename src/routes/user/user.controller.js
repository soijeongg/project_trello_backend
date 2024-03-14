import { emailSchema, passwordSchema, nicknameSchema } from './user.joi.js';

export class userController {
  constructor(userService) {
    this.userService = userService;
  }
  //회원가입하러 들어온다 그럼 리퀘스트 바디에 있겠지
  postSignUpcontroller = async (req, res, next) => {
    try {
      let { email, password, nickname } = req.body;
      let emailvalidation = emailSchema.validate({ email });
      if (emailvalidation.error) {
        const error = new Error('이메일에는 이메일 형식만 입력해주세요');
        error.status = 404;
        throw error;
      }
      let passwordvalidation = passwordSchema.validate({ password });
      if (passwordvalidation.error) {
        const error = new Error('비밀번호는 5자 이상 15자 이내 아이디가 들어가 있지 않게 만들어주세요');
        error.status = 404;
        throw error;
      }
      let nicknamevalidation = nicknameSchema.validate({ nickname });
      if (nicknamevalidation.error) {
        const error = new Error('닉네임은 2자 이상 20자 이내로 입력해주세요');
        error.status = 404;
        throw error;
      }
      let signup = await this.userService.createEmailService(email, password, nickname);
      if (!signup) {
        const error = new Error('회원가입에 실패했습니다 ');
        throw error;
      }
      return res.status(200).json({ message: `${nickname}님 환영합니다` });
    } catch (error) {
      next(error);
    }
  };
  //아이디체크하러 들어온다
  idCheckController = async (req, res, next) => {
    try {
      let { email } = req.body;
      let emailvalidation = emailSchema.validate({ email });
      if (emailvalidation.error) {
        const error = new Error('이메일에는 이메일 형식만 입력해주세요');
        error.status = 404;
        throw error;
      }
      await this.userService.checkEnailed(email);
      return res.status(200).json({ message: '중복되지 않는 이메일 입니다' });
    } catch (error) {
      next(error);
    }
  };

  //로그인하러 들어온다
  loginController = async (req, res, next) => {
    try {
      let { email, password } = req.body;
      let emailvalidation = emailSchema.validate({ email });
      if (emailvalidation.error) {
        const error = new Error('이메일에는 이메일 형식만 입력해주세요');
        error.status = 400;
        throw error;
      }
      let passwordvalidation = passwordSchema.validate({ password });
      if (passwordvalidation.error) {
        const error = new Error('비밀번호는 5자 이상 15자 이내 아이디가 들어가 있지 않게 만들어주세요');
        error.status = 400;
        throw error;
      }
      let log = await this.userService.logined(email, password);
      const [nickname, userId] = log.split(',');
      req.session.user = { userId: userId };
      res.status(200).json({ messages: `${nickname}님 안녕하세요` });
    } catch (error) {
      next(error);
    }
  };

  //자 이제 회원정보 바꾸러 들어온다
  putLoginController = async (req, res, next) => {
    try {
      let { email, password, nickname } = req.body;
      if (email) {
        let emailValidation = emailSchema.validate({ email });
        if (emailValidation.error) {
          const error = new Error('이메일에는 이메일 형식만 입력해주세요');
          error.status = 400;
          throw error;
        }
      }

      // 비밀번호와 닉네임에 대한 유효성 검사는 email 필드가 존재할 때만 진행됩니다.
      if (password) {
        let passwordValidation = passwordSchema.validate({ password });
        if (passwordValidation.error) {
          const error = new Error('비밀번호는 5자 이상 15자 이내이며, 특수 문자나 공백이 없어야 합니다');
          error.status = 400;
          throw error;
        }
      }

      if (nickname) {
        let nicknameValidation = nicknameSchema.validate({ nickname });
        if (nicknameValidation.error) {
          const error = new Error('닉네임은 2자 이상 20자 이내이어야 합니다');
          error.status = 400;
          throw error;
        }
      }

      let { userId } = res.locals.user;


      if (email && !password && !nickname) {
        let updateEs = await this.userService.updateUserServiceEmail(email, userId);
        res.status(200).json({ message: '성공적으로 수정했습니다' });
      }
      if (!email && password && !nickname) {
        let updatePs = await this.userService.updateUserServicePassword(password, userId);
        res.status(200).json({ message: '성공적으로 수정했습니다' });
      }
      if (!email && !password && nickname) {
        let updateN2 = await this.userService.updateUserServiceNickname(nickname, userId);
        
        res.status(200).json({ message: '성공적으로 수정했습니다' });
      }

      if (email && password && !nickname) {
        await this.userService.updateUserEmailPassword(email, password, userId);
     
        res.status(200).json({ message: '성공적으로 수정했습니다' });
      }
      if (!email && password && nickname) {
        await this.userService.updateUserPasswordNickname(password, nickname, userId);
        
        res.status(200).json({ message: '성공적으로 수정했습니다' });
      }

      if (email && !password && nickname) {
        await this.userService.updateUserEmailNickname(email, nickname, userId);
        
        res.status(200).json({ message: '성공적으로 수정했습니다' });
      }

      if (email && password && nickname) {
        await this.userService.updateUserPassportsNicknameEmail(password, nickname, email, userId);
        
        res.status(200).json({ message: '성공적으로 수정했습니다' });
      }
    } catch (error) {
      next(error);
    }
  };

  //삭제하자
  deleteController = async (req, res, next) => {
    try {
      let { user } = res.locals;
      let { userId } = user;
      await this.userService.deleteUserService(userId);
      return res.status(200).json({ message: '성공적으로 탈퇴되었습니다' });
    } catch (error) {
      // 오류 발생 시 오류를 다음 미들웨어로 전달
      next(error);
    }
  };
  logoutController = async (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('세션 파기 중 오류 발생:', err);
        return res.status(500).json({ message: '서버 오류' });
      }
      //
      res.locals = {};
      res.status(200).json({ message: '로그아웃 되었습니다' });
    });
  };
}
