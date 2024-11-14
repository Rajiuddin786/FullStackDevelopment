const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/tickets").then(
    ()=>{
        console.log("TRUE");
    }
).catch((e)=>{
    console.log(e);
})