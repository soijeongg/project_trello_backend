import passport from "passport";

export default  function isNotLoggin (req,res, next){
    if(!req.isAuthenticated()){
        next()
    }
    else{
        
        res.json({message:"이미 로그인 된상태 입니다"})
    }



}