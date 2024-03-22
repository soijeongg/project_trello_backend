//가입에 필요  chekemail,checknickname  이둘은 유니크
//그리고 이 둘을 통과햐면 prisma.User를 통해  만들어준다
import argon2 from 'argon2';

export class userRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  //1. 일단 들어온 이메일 검사 및 아이디 있는지 확인
  checkEmail = async (email) => {
    let checkE = await this.prisma.User.findFirst({
      where: { email: email },
    });
    return checkE;
  };

  //2 들어온 닉네임검사
  checkNickname = async (nickname) => {
    let checkN = await this.prisma.User.findFirst({
      where: { nickname: nickname },
    });
    return checkN;
  };
  //4. 비밀번호 있는지 확인
  finpass = async (password) => {
    let findpassword = await this.prisma.User.findFirst({
      where: { password: password },
    });
    return findpassword;
  };

  //3. 들어온 email nickname, password를 가지고 검사하기
  createUser = async (email, password, nickname, verificationToken) => {
    const hashedPassword = await argon2.hash(password);
    let createOne = await this.prisma.User.create({
      data: { email, nickname, password: hashedPassword, verificationToken },
    });
    return createOne;
  };
  // ==========================들어온 userid를 가지고 닉네임을 보내보자 =========================================================================
  findNickname = async (userId) => {
    let nicknameOne = await this.prisma.User.findFirst({
      where: { userId: userId },
    });
    let userNickname = nicknameOne.nickname;
    return userNickname;
  };

  // ============================================================== 수정=================================================================
  //닉네임만 들어왔을때 업데이트 하는 함수
  updateNickname = async (nickname, userId) => {
    let updatedname = await this.prisma.User.update({
      data: { nickname },
      where: { userId: +userId },
    });
    return updatedname;
  };
  //비밀번호가 들어왔을때 업데이트 하는 함수
  updatePassword = async (password, userId) => {
    const hashedPassword = await argon2.hash(password);
    let updatedPassword = await this.prisma.User.update({
      data: { password: hashedPassword },
      where: { userId: +userId },
    });
    return updatedPassword;
  };
  //이메일이 들어왔을때 업데이트 하는 함수
  updateEmail = async (email, userId) => {
    let updatedEmail = await this.prisma.User.update({
      data: { email },
      where: { userId: +userId },
    });
    return updatedEmail;
  };

  //닉네임과 비밀번호가 들어왔을떄 업데이트 하는 함수
  updatePasswordNickname = async (nickname, password, userId) => {
    const hashedPassword = await argon2.hash(password);
    let updateNickPass = await this.prisma.User.update({
      data: { nickname, password: hashedPassword },
      where: { userId: +userId },
    });
    return updateNickPass;
  };

  //이메일과 비밀번호가 들어왔을때 업데이트 하는 함수
  updateEmailPassword = async (email, password, userId) => {
    const hashedPassword = await argon2.hash(password);
    let updateEmailPass = await this.prisma.User.update({
      data: { email, password: hashedPassword },
      where: { userId: +userId },
    });
    return updateEmailPass;
  };

  //이메일 닉네임이 들어왔을때 업데이트 하는 함수
  updateEmailNickname = async (email, nickname, userId) => {
    let updateEN = await this.prisma.User.update({
      data: { email, nickname },
      where: { userId: +userId },
    });
    return updateEN;
  };

  //이메일 닉네임 비밀번호
  updateEmailNicknamePassword = async (email, nickname, password, userId) => {
    const hashedPassword = await argon2.hash(password);
    let updateENP = await this.prisma.User.update({
      data: { email, nickname, password: hashedPassword },
      where: { userId: +userId },
    });
    return updateENP;
  };

  // ================================================= 회원 탈퇴 ======================================================================
  deleteUser = async (userId) => {
    let deleteOne = await this.prisma.User.delete({
      where: { userId: +userId },
    });
    return deleteOne;
  };

  //==========================================================이메일인증=====================================================
  findUserByToken = async (token) => {
    return await this.prisma.User.findUnique({
      where: {
        verificationToken: token,
      },
    });
  };
  updateStatus = async (userId) => {
    return await this.prisma.User.update({
      where: {
        userId: userId,
      },
      data: {
        isVerified: true,
      },
    });
  };
}
