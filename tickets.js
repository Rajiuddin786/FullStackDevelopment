const mongoose=require("mongoose");

const tickets=mongoose.Schema({
    ticket:{type:String},
})

const Register=new mongoose.model("ticket",tickets);
module.exports=Register;