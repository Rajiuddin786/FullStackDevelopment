const mongoose=require("mongoose");

const tickets=mongoose.Schema({
    ticket:{type:String},
    status:{type:String, default:"In Progress"},
    deleted:{type:Boolean, default: false},
    email:{type:String},
    reply:{type:String,default:""}
})

const Register=new mongoose.model("ticket",tickets);
module.exports=Register;