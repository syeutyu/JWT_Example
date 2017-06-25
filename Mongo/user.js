var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    username : String,
    password : String,
    admin : {type:Boolean,default:false}
});

user.statics.create = function(username,password){
    var use = new this({
        username,
        password
    })
    return use.save();
};
//유저 아이디 가져오기
user.statics.findOneByUsername = function(username){
    return this.findOne({user}).exec();
};
//비밀번호가 맞는 지확인
user.methods.verify = function(password){
    return this.password === password;
};

//관리자 계정으로 설정
user.methods.assignAdmin = function(){
    this.admin = true;
    return this.Save();
};
module.exports = mongoose.model('user',user);