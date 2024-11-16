const mongoose = require('mongoose');

const user = mongoose.Schema({
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String},
    password:{type:String},
})