const mongoose = require('mongoose');

const user = mongoose.Schema({
    first_name:{type:String,required: true},
    last_name:{type:String,required: true},
    email:{type:String,unique:true,required: true},
    password:{type:String,required: true},
})

const Register=new mongoose.model("user_datas",user);
module.exports=Register;