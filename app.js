const express = require("express")
const port = process.env.PORT || 3000
const hbs=require("hbs")
const bodyParser = require("body-parser")
const path = require("path")
require("./Database/mongodb.js")
const register = require("./Database/tickets.js")
const user_data=require("./Database/user.js")
const admin_data=require("./Database/admin.js")
const partials = path.join(__dirname, "./Partials")
const session = require("express-session")



const app = express()

app.use("/images",express.static(path.join(__dirname, './Public/assets')));

app.set("view engine", "hbs")
app.set("views", path.join(__dirname,"hbs_templates"))
hbs.registerPartials(partials)
app.use(bodyParser.urlencoded({ extended: true }))


app.listen(port,()=>{
console.log(`Server started on port ${port}`)
})

app.use(
    session(
        {
            secret:"ddsc12",
            resave:false,
            saveUninitialized:true,
            cookie:false
        }
    )
)

app.get("/",(req,res)=>{
    res.render("home_page")
})

app.get("/logout-:user", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/");
        }
        const type_user = req.params.user;
        const message = "Logout Successful!";
        res.redirect(`login-${type_user}`);
    });
});

app.get("/login-admin",(req,res)=>{
    res.render("login-admin")
})
app.post("/authenticate-admin", async (req, res) => {
    const user_id = req.body.admin_id;
    const user_pass = String(req.body.admin_pass);

    const validate_admin = await admin_data.findOne({ email: user_id });
    if (!validate_admin) {
        res.send("Failed to login admin");
    } else {
        const password_admin = validate_admin.password;
        if (password_admin == user_pass) {
            req.session.admin = { id: validate_admin._id, email: user_id };
            res.redirect("/view-tickets")
        } else {
            res.send("Invalid password");
        }
    }
});
app.get(`/view-tickets`,async (req, res)=>{
    if(req.session.admin) {
        const data = await register.find()
        res.render("view_tickets", {tickets: data, user: "admin"})
    }
    else{
        res.redirect("/login-admin");
    }
})
app.post("/update_status",async (req,res)=>{
    if(req.session.admin) {
        const curr_status = req.body.status
        const id = req.body.id;
        await register.updateOne({_id: id}, {$set: {status: curr_status}})
        res.redirect("/view-tickets")
    }
    else{
        res.redirect("/login-admin");
    }
})
app.get("/delete-:id",async (req,res)=>{
    if(req.session.admin) {
        const id = req.params.id;
        await register.deleteOne({_id: id})
        res.redirect("/view-tickets")
    }
    else{
        res.redirect("/login-admin")
    }
})
app.get("/ticket-view-page-:id",async (req,res)=>{
    if(req.session.admin) {
        const id = req.params.id;
        const data = await register.findOne({_id: id})
        const ticket = data.ticket
        res.render("ticket-view-page", {user_ticket: ticket, user_id: id,user:"admin"})
    }
    else{
        res.redirect("/login-admin")
    }
})
app.get("/reply-page-:id",(req,res)=>{
    if(req.session.admin) {
        const user_id = req.params.id;
        res.render("reply-page", {id: user_id,user:"admin"})
    }
    else{
        res.redirect("login-admin")
    }
})
app.post("/reply-to-user-:id",async (req,res)=>{
    if(req.session.admin) {
        const id = req.params.id;
        const reply_to_user = req.body.response_to_user;
        const user = await register.updateOne({_id: id}, {$set: {reply: reply_to_user}})
        res.redirect(`/view-tickets`)
    }
    else{
        res.redirect("/login-admin")
    }
})
app.get("/login-user",async (req,res)=>{
    res.render("login-user")
})
app.post("/login-user",async (req,res)=>{
    const user_id = req.body.user_id;
    const user_pass=req.body.user_pass;

    const validate_user = await user_data.findOne({email:user_id})
    if(!validate_user){
        res.send("Account Not Found")
    }
    else{
        const password=validate_user.password
        if(user_pass===password){
            req.session.user = { id: validate_user._id, email: user_id };
            res.redirect(`/tickets-user-${user_id}`);
        }
        else{
            res.send("Password does not match")
        }
    }

})
app.get("/sign-up",async (req,res)=>{
    res.render("sign-up-page",)
})
app.post("/sign-up_new-user",async (req,res)=>{
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;
    const password=req.body.password;
    const cpassword=req.body.cpassword;

    if(!fname || !lname || !email || !password || !cpassword){
        res.send("Please Enter Valid Credentials")
    }
    else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        if (password == cpassword) {
            if (isValid) {
                try {
                    const data = new user_data({
                        first_name: fname,
                        last_name: lname,
                        email: email,
                        password: password,
                    })
                    const inserted_data = await data.save();
                    res.send("Account Create Successfully")
                } catch (err) {
                    if (err.code == 11000) {
                        res.send("Email Already Exist")
                    }
                }
            } else {
                res.send("Enter a Valid Email")
            }
        } else {
            res.send("Passwords don't match")
        }
    }
})
app.get("/tickets-user-:id",async (req,res)=>{
    if(req.session.user) {
        const id = req.params.id
        res.render("tickets", {email: id})
    }
    else{
        res.redirect("login-user")
    }
})
app.get("/create-ticket-page-:id",(req,res)=>{
    if(req.session.user) {
        const id = req.params.id
        res.render("create-tickets-page", {email: id,user:"user"})
    }
    else{
        res.redirect("/login-user")
    }
})
app.post("/generate-tickets-:id",async (req,res)=>{
    if(req.session.user) {
        const id = req.params.id
        const query = req.body.write_ticket;
        try {
            const insert_ticket = new register({
                ticket: query,
                email: id,
            })
            const inserted_ticket = await insert_ticket.save()
            res.render("confirm_submission", {email: id})
        } catch (e) {
            res.status(404).send(e)
        }
    }
    else{
        res.redirect("/login-user")
    }
})
app.get("/track-ticket-page-:id",async (req,res)=>{
    if(req.session.user) {
        const id = req.params.id
        const data = await register.find({deleted: false, email: id})
        res.render("track-tickets-page", {tickets: data, email: id, user: "user"})
    }
    else{
        res.redirect("/login-user")
    }
})
app.post("/delete-ticket-:user_id",async (req,res)=>{
    if(req.session.user) {
        const id = req.body.id
        const userid = req.params.user_id
        await register.updateOne({_id: id}, {$set: {deleted: true}})
        res.redirect(`/track-ticket-page-${userid}`)
    }
    else{
        res.redirect("/login-user")
    }
})
app.post("/reply-to-ticket-:email",async (req,res)=>{
       if(req.session.user) {
           const id = req.body.id
           const data = await register.findOne({_id: id})
           res.render("view_reply", {reply: data.reply, email: req.params.email, user: "user"})
       }
       else{
           res.redirect("/login-user")
       }
})