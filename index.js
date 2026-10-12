const express = require('express');
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const {User} = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI).then(() => console.log('MonogoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! ^_2^')
});

app.post('/api/users/register', async (req, res) => {
  // 회원 가입시 필요한 정보 client에서 가져오면
  // 그것을 데이터베이스에 넣는다

  const user = new User(req.body);

  try{
    const userInfo = await user.save();
    res.status(200).json({
      success: true,
      userInfo
    });
  } catch(err){
    res.status(500).json({
      success: false,
      err: err.message
    });
  }

  // user.save((err, userInfo) => {
  //   if(err) return res.json({ success: false, err});
  //   return res.status(200).json({
  //   success: true
  //   })
  // })
});

app.post('/api/users/login', async (req, res) => {

  try {
    // 1. 이메일로 사용자 조회
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({
          loginSuccess: false,
          message: '제공된 이메일에 해당하는 유저가 없습니다.'
        });
      }

    // 2. 비밀번호 확인
    const isMatch = await new Promise((resolve, reject) => {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return reject(err);
        resolve(isMatch);
      });
    });

    if (!isMatch) {
      return res.status(400).json({
        loginSuccess: false,
        message: '비밀번호가 틀렸습니다.'
      });
    }

    // 3. 비밀번호가 일치하면 토큰 생성
    const token = await new Promise((resolve, reject) => {
      user.generateToken((err, userWithToken) => {
        if (err) return reject(err);
        resolve(userWithToken.token);
      });
    });

    // 4. 쿠키에 토큰 저장
    return res.cookie('x_auth', token)
      .status(200)
      .json({
        loginSuccess: true,
        userId: user._id
      });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      loginSuccess: false,
      message: '로그인 처리 중 오류가 발생했습니다.'
    });
  }

/*
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다. "
      });
    }
  });

  // 요청한 비밀번호가 같은지 확인한다.
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch){
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
    } else {
      // 비밀번호 일치하면 token 생성
      user.generateToken((err, user) => {
        if(err){
          return res.status(400).send(err);
        } else {
          // 토큰을 저장한다. 쿠키, 로컬스토리지, 세션 등등
          // 쿠키에 저장하려면 라이브러리 추가 설치 필요
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id})
        }
      });
    }
  });
  */
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});