const express = require('express');
const app = express()
const port = 5000

const bodyParser = require('body-parser');

const config = require('./config/key');

const {User} = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(() => console.log('MonogoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! ^_2^')
})

app.post('/register', async (req, res) => {
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
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})