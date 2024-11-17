const mongoose = require('mongoose');

const data=mongoose.Schema({
    email:{type:String,unique:true},
    password:{type:String},
})

const Register = new mongoose.model("admin_datas",data)
module.exports=Register;