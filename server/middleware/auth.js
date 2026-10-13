const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리하는 곳

    // 클라이언트 쿠케에서 토큰을 가져온다
    let token = req.cookies.x_auth;

    console.log("---로그 출력----");
    console.log("======> ",{token});

    // 토큰 복호화 -> 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err){
            throw err;
        }
        if(!user){
            return res.json({
                isAuth: false,
                error: true
            });
        }

        req.token = token;
        req.user = user;
        next();
    });


    // 유저 있으면 인증 ok

    // 유저 없으면 인증 no

}

// 다른 파일에서도 쓸 수 있게
module.exports = { auth };