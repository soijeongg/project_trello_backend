import argon2 from "argon2"
export class userService{
  constructor(userRespository){
    this.userRespository = userRespository
  }

  //회원가입을 하자 
  createEmailService = async(email, password, nickname)=>{
    let checke = await this.userRespository.checkEmail(email)
    //넘어온 이메일이 있으면 에러를 일으킨다 
    if(checke){
        const error = new Error("이미 등록된 이메일 입니다 ")
        error.status = 401;
        throw error
    }
    //없으면 닉네임 검사를 진행
    let checkn = await this.userRespository.checkNickname(nickname)
    if (checkn) {
      const error = new Error('이미 등록된 닉네임 입니다 ');
      error.status = 401;
      throw error;
    }
    //이걸 통과했다면 이제 만들어보자 
    let createOne = await this.userRespository.createUser(email, password, nickname);
    if(!createOne){
        const error = new Error("회원가입에 실패했습니다 다시 시도해주세요")
        error.status = 500
        throw error
    }
    return createOne
}
//================================================아이디 중복체크를 해보자 ===============================================================================
    checkEnailed = async(email)=>{
        let checkI = await this.userRespository.checkEmail(email)
        if(checkI){
            const error = new Error("이미 등록된 이메일 입니다 ")
            error.status = 401;
            throw error
    }
    return checkI
        }
    
// ============================================ 로그인을 해보자 =================================================================================
    logined = async(email, password)=>{
        let findI = await this.userRespository.checkEmail(email)
        if(!findI){
            const error = new Error('이메일이나 비밀번호가 맞지 않습니다  ');
            error.status = 401;
            throw error;

        }
    let checkpasswords = await argon2.verify(findI.password, password);
    if (!checkpasswords) {
        const error = new Error('이메일이나 비밀번호가 맞지 않습니다  ');
        error.status = 401;
        throw error;
    }
    return `${findI.nickname},${findI.userId}`;

}
//====================================닉네임을 보내보자==================================
    getNickname = async(userId)=>{
        let nicknameGet = await this.userRespository.findNickname(userId);
        if(!nicknameGet){
            const error = new Error('닉네임을 가져오는데 실패했습니다');
            throw error;
        }
        return nicknameGet
    }


// ========================================== 회원 정보 수정을 해보자 ===========================================================================
    updateUserServiceEmail = async(email,userId)=>{
        //현재 가지고 있는 세션에서 유저 아이디를 가져와 그거를 where로 바꿔준다 
        let updaeteUserE = await this.userRespository.updateEmail(email,userId);
        if(!updaeteUserE){
            const error = new Error("수정에 실패했습니다")
            throw error
        }
        return updaeteUserE

    }

//2. 닉네임
    updateUserServiceNickname = async(nickname, userId)=>{
         
        
        let updatedUserN = await this.userRespository.updateNickname(nickname, userId)
        if(!updatedUserN){
        const error = new Error('수정에 실패했습니다');
        throw error;
        }
        return updatedUserN
        
    }



//3. 비밀번호 
    updateUserServicePassword = async(password, userId)=>{
        let updateUserP = await this.userRespository.updatePassword(password, userId)
        if(!updateUserP){
            const error = new Error('수정에 실패했습니다');
            throw error;
        }
        return updateUserP
    }

//4. 이메일 닉네임
    updateUserEmailNickname = async(email, nickname, userId)=>{
        let updateUserEN = await this.userRespository.updateEmailNickname(email, nickname, userId)
        if(!updateUserEN){
            const error = new Error('수정에 실패했습니다');
            throw error;
        }
        return updateUserEN

    }



//5. 이메일 비밀번호
updateUserEmailPassword = async(email, password, userId)=>{
    let updateUSerEP = await this.userRespository.updateEmailPassword(email, password, userId)
    if(!updateUSerEP){
         const error = new Error('수정에 실패했습니다');
         throw error;
    }
    return updateUSerEP
}



//6. 비밀번호 닉네임
updateUserPasswordNickname = async(password, nickname,userId)=>{
    let updateUSerPN = await this.userRespository.updatePasswordNickname(nickname, password,userId);
    if(!updateUSerPN){
           const error = new Error('수정에 실패했습니다');
           throw error;
    }
    return updateUSerPN
}



//7. 비밀번호 닉네임 이메일
updateUserPassportNicknameEmail = async(password, nickname, email,userId)=>{
    let updateUserPNE = await this.userRespository.updateEmailNicknamePassword(email, nickname, password, userId)
    if(!updateUserPNE){
          const error = new Error('수정에 실패했습니다');
          throw error;
    }
    return updateUserPNE
}


//=======================================================회원 삭제를 ======================================================
deleteUserService = async(userId)=>{
    let deleteuser = await this.userRespository.deleteUser(userId);
    if(!deleteuser){
        const error = new Error('삭제에 실패했습니다');
        throw error;
    }
    return deleteuser
}



}