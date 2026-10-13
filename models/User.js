const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});


userSchema.pre('save', async function(){
    var user = this;

    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;

        // bcrypt.genSalt(saltRounds, function(err, salt){
        //     if(err) return next(err);

        //     bcrypt.hash( user.password, salt, function(err, hash) {
        //         if(err) return next(err);
        //         user.password = hash;
        //         next();
        //     });
        // });
    }
    
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword : 1234567 암호화된 비밀번호 같은지 체크
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = async function(cb) {
    try {
        const user = this;

        // JSON Web Token 생성
        const token = jwt.sign(
            user._id.toString(),
            'secretToken'
        );

        user.token = token;

        // 콜백 대신 await 사용
        const savedUser = await user.save();

        cb(null, savedUser);
    } catch (err) {
        cb(err);
    }
    /*
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user.id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user){
        if(err){
            return cb(err);
        } else {
            cb(null, user);
        }
    });
    */
}

userSchema.statics.findByToken = function(token, cb) {
    const user = this;

    // 토큰이 없는 경우
    if (!token) {
        return cb(null, null);
    }

    // 토큰 검증
    jwt.verify(token, 'secretToken', async function(err, decoded) {
        if (err) {
            return cb(null, null);
        }

        try {
            // Mongoose에서는 await로 조회
            const foundUser = await user.findOne({
                _id: decoded,
                token: token
            });

            return cb(null, foundUser);
        } catch (err) {
            return cb(err);
        }
    });
};
/*
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode한다
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) {
                return cb(err);
            } else {
                cb(null, user);
            }
        });
    });
}
*/

const User = mongoose.model('User', userSchema);

module.exports = {User}