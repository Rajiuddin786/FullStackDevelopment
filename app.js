const express = require("express")
const port = process.env.PORT || 3000
const hbs=require("hbs")
const bodyParser = require("body-parser")
const path = require("path")


const app = express()

app.use(express.static(path.join(__dirname, 'src')));
app.set("views", path.join(__dirname,"../src"))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname,"hbs_templates"))
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port,()=>{
console.log(`Server started on port ${port}`)
})

app.get("/",(req,res)=>{
    res.send("Hello World!")
})

app.get("/login-admin",(req,res)=>{
    res.sendFile(path.join(__dirname,"./src/login-admin.html"))
})
app.post("/login-admin",async (req,res)=>{
    const user_id = req.body.admin_id;
    const user_pass=req.body.admin_pass;
    console.log(user_id)
    res.send("Successfully logged in!")
})
app.get("/login-user",(req,res)=>{
    res.sendFile(path.join(__dirname,"./src/login-user.html"))
})
app.post("/login-user",async (req,res)=>{
    const user_id = req.body.user_id;
    const user_pass=req.body.user_pass;
    console.log(user_id)
    res.send("Successfully logged in!")
})
app.get("/tickets-user",(req,res)=>{
    res.render("tickets")
})
app.get("/create-ticket-page",(req,res)=>{
    res.render("create-tickets-page")
})
app.post("/generate-tickets",async (req,res)=>{
    const query=req.body.write_ticket;
    res.send(query)
})
app.get("/track-ticket-page",(req,res)=>{
    res.send("Hello")
})