require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs  = require("ejs")
const app = express()
const mongoose = require("mongoose")

const encrypt = require("mongoose-encryption")
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/secret")

const userSchema = new mongoose.Schema({email:String,password:String})



userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]}) //here we provide the name of the database and the name of the fields that we wnat ot encrypt

const userModel = new mongoose.model('user',userSchema)

app.get("/",function(req,res){
    res.render("home")
})


app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
const newUser = new userModel({email:req.body.username,password:req.body.password})
newUser.save(function(err){
    if(err)
    {console.log(err)}
    else
    {res.render("secrets")}
})
})

app.post("/login",function(req,res){
    const username = req.body.username
    const password = req.body.password

    userModel.findOne({email:username},function(err,foundUser){
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(foundUser.password === password){
                res.render("secrets")
            }
        }
    })
    

})
app.listen(3000,function(){
    console.log("server started at port 3000")
})