const express = require("express");
const path = require("path");
const app = express();
require("./db/conn");
const Register = require("./models/registers");
const hbs = require("hbs");
const port = process.env.PORT || 3000;


const static_path = path.join(__dirname ,  "../public");
const template_path = path.join(__dirname , "../templates/views");
const partials_path = path.join(__dirname , "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use(express.static(static_path));
app.set("view engine" , "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index"); 
});
app.get("/register.hbs", (req, res) => {
    res.render("register"); 
});
// create a new user in our database
app.post("/notes", async(req, res) => {
    try{
        const registerEmployee =new Register({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            phone : req.body.phone,
            password : req.body.password,
            email : req.body.email,
            rdiobtn : req.body.rdiobtn
        });
        const registerd = await registerEmployee.save();
        res.status(201).render("notes");
    }catch(error){
        res.status(400).send(error);
}
});


//login check
app.post("/index", async(req, res) => {
     try{
         const email = req.body.email;
         const password = req.body.password;
         check =  typeof(email);
         //console.log(`${email} and ${phone}`);
         //if( check === Number){
             //const useremail = await Register.findOne({phone : email});
        // } else{
             const useremail = await Register.findOne({email: email});
        // }
         
         
         //res.send(useremail);
         //console.log(useremail);
         
         if(useremail.password === password ){
             res.status(201).render("notes");
         } else{
             res.render("index");
         }
     } catch (error){
         res.status(400).send("invalid Email or password");
}
});


app.listen(port, () => {
    console.log(`server started`);
});
