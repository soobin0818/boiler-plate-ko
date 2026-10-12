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

const User = mongoose.model('User', userSchema);

module.exports = {User}