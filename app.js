const express = require("express")
const port = process.env.PORT || 3000
const hbs=require("hbs")
const bodyParser = require("body-parser")
const path = require("path")
require("./Database/mongodb.js")
const register = require("./Database/tickets.js")
const logout_btn = path.join(__dirname, "./Partials")


const app = express()

app.set("view engine", "hbs")
app.set("views", path.join(__dirname,"hbs_templates"))
hbs.registerPartials(logout_btn)
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port,()=>{
console.log(`Server started on port ${port}`)
})

app.get("/",(req,res)=>{
    res.render("home_page")
})

app.get("/login-admin",(req,res)=>{
    res.render("login-admin")
})
app.post("/login-admin",async (req,res)=>{
    const user_id = req.body.admin_id;
    const user_pass=req.body.admin_pass;
    res.send('<script>window.location.href="/view-tickets"</script>')
})
app.get(`/view-tickets`,async (req, res)=>{
    const data = await register.find()
    res.render("view_tickets",{tickets:data})
})
app.post("/update_status",async (req,res)=>{
    const curr_status=req.body.status
    const id=req.body.id;
    await register.updateOne({_id:id},{$set:{status:curr_status}})
    res.send('<script>window.location.href="/view-tickets"</script>')
})
app.get("/delete-:id",async (req,res)=>{
    const id=req.params.id;
    await register.deleteOne({_id:id})
    res.send('<script>window.location.href="/view-tickets"</script>')
})
app.get("/ticket-view-page-:id",async (req,res)=>{
    const id=req.params.id;
    const data= await register.find({_id:id})
    res.render("ticket-view-page",{tickets:data})
})
app.get("/login-user",(req,res)=>{
    res.render("login-user")
})
app.post("/login-user",async (req,res)=>{
    const user_id = req.body.user_id;
    const user_pass=req.body.user_pass;
    console.log(user_id)
    res.send("<script>window.location.href='/tickets-user'</script>")
})
app.get("/sign-up",(req,res)=>{
    res.render("sign-up-page")
})
app.get("/tickets-user",(req,res)=>{
    res.render("tickets")
})
app.get("/create-ticket-page",(req,res)=>{
    res.render("create-tickets-page")
})
app.post("/generate-tickets",async (req,res)=>{
    const query=req.body.write_ticket;
    try{
    const insert_ticket = new register({
        ticket:query,
    })
    const inserted_ticket = await insert_ticket.save()
    res.render("confirm_submission")
    }
    catch(e){
        res.status(404).send(e)
    }
})
app.get("/track-ticket-page",async (req,res)=>{
    const data = await register.find({deleted:false})
    res.render("track-tickets-page",{tickets:data})
})
app.post("/delete-ticket",async (req,res)=>{
    const id =req.body.id
    await register.updateOne({_id:id},{$set:{deleted:true}})
    res.send("<script>window.location.href='/track-ticket-page'</script>")
})