//require('dotenv').config();
const port = process.env.PORT || 3000;

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser')
const path = require("path");
const app = express();
//require(__dirname , "../templates/example.env");
require("./db/conn");
const f = require("./middleware/functions"); 
//const rstpsdDateCheck = require("./middleware/dateCheck"); 
//require('dotenv').config();
const sgMail = require("@sendgrid/mail") ;
const Register = require("./models/registers");
const hbs = require("hbs");
const bcrypt = require("bcryptjs") ;
const flash = require("connect-flash") ;
var session = require("express-session") ;
const crypto = require("crypto") ;
//import ${ getRandomString } from 'random' ;
//let val = getRandomString();
//const port = process.env.PORT || 3000;


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const static_path = path.join(__dirname ,  "../public");
const template_path = path.join(__dirname , "../templates/views");
const partials_path = path.join(__dirname , "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser())
app.use(express.static(static_path));
app.use(session({
    secret : 'secret',                               //pass object secret in any  string , here pass secret string
    cookie : {maxAge : 60*60*1000},                       // cookie take a object , in object takes milisec. for maxage
    resave : false,                                 // dont make havey
    saveUninitialized : true                         // it dont save modify session
}
));
app.use(flash());
app.set("view engine" , "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


// authentication
/*
sessionStorage.setItem("lastname", "Smith");
// Retrieve
 = sessionStorage.getItem("lastname");
*/

//var flag = false;

const authUser = function (req , res , next){
    //var    flag = sessionStorage.getItem("flag");
   // console.log(req.session.isUser);
    if( !req.session.isUser){
      //  res.status(403)

        return ( res.send('you need to LOGIN <br> click on link for <a href="/index">LOGIN </a>  ')) ;
    }
    next()
}


//get routes

app.get("/", (req, res) => {
    req.session.isUser = false;
    res.render("home");
});


app.get("/demonotes", (req, res) => {
    res.render("demonotes");
});

app.get("/notes" , authUser, (req, res) => {
    res.render("notes");
});

app.get("/homeLogined", authUser, (req, res) => {
    res.render("homeLogined");
});

app.get("/todo", authUser, (req, res) => {
    res.render("todo");
});

app.get("/index", (req, res) => {
    res.render("index"); 
});
app.get("/register", (req, res) => {
    //flag = false;
    res.render("register",{message : req.flash('message')}); 
});
app.get("/forget-password", (req, res) => {
    //flag = false;
    res.render("forget-password"); 
});

app.get("/reset-password", (req, res) => {
   // flag = false;
    res.render("reset-password"); 
});


// create a new user in our database
app.post("/register", async(req, res) => {
    try{
         var cpass =  req.body.password;
        //console.log(cpass);
        // console.log(`${cpass}`);
        const  hashpass = await bcrypt.hash(cpass , 10);
        //console.log(`${hashpass}`);
        
        const registerEmployee =new Register({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            phone : req.body.phone,
            password : hashpass,
            email : req.body.email,
            rdiobtn : req.body.rdiobtn,
            emailtoken : crypto.randomBytes(64).toString('hex'),
            isverified : false,
            resetToken : null ,
            regiserTime : new Date().getTime() + 5*60*60*1000 +30*60*1000 
        });
      //  http://${req.headers.host}/verify-email?token=${Register.emailtoken}
        // middlewre is used in register.js
        const registerd = await registerEmployee.save();
        const msg = {
                to: req.body.email,
                from: {
                    name:'Web Notes',
                    email:'ptu.project.6@gmail.com',
                }, // Use the email address or domain you verified above
                subject: 'Verify your email',
                text: `Hello ${req.body.first_name} , thanks for registering Notes.
                    Please verify account
                    ${req.protocol}://${req.headers.host}/verify-email?token=${registerd.emailtoken}
                    `,
                html: `
                   <h1> Hello ${req.body.first_name} , thanks for registering Notes. </h1>
                   <p> Please verify account </p>
                    <a href="${req.protocol}://${req.headers.host}/verify-email?token=${registerd.emailtoken}">verify , your account</a>
                    `,
                };
                //${req.protocol}://${req.headers.host}/verify-email/${registerd.emailtoken}
                try {
                    await sgMail.send(msg);
                    // req.flash("SUS" ,"WOW") ;              
                    //res.status(201).render("notes");
                    res.send(" Please verify your email. <br> Check your email inbox ");
                } catch (error) {
                    console.error(error);

                if (error.response) {
                        console.error(error.response.body)
                }
            }
       // req.flash("SUS" ,"WOW") ;              
       // res.status(201).render("notes");
    }catch(error){
       res.send(` ${ req.body.first_name}  , you are already registered.` );
        // req.flash('message', 'you are already registered') ; 
        //res.render("register",{message : req.flash('message')}); 
       //res.redirect('back');
        //res.status(400).send(error);
}
});


// verify token
app.get("/verify-email", async(req, res) => {
    try{
        const user =  await Register.findOne({emailtoken: req.query.token});
        if(!user) (
        res.send(` you are not registered.` )
        )
        user.emailtoken = null;
        user.isverified = true;
        await user.save();
        res.status(201).redirect("/")
    }catch(error){
       //res.send(error, ` something went wrong,please try after some time `);
        // req.flash("SUS" ,"WOW") ;              
      //  res.redirect('back');
        res.status(400).send(error);
}
});


// link ${req.protocol}://${req.headers.host}/reset-password/${userReset.resetToken}`

//  forget-password
app.post("/forget-password", async(req, res) => {
    try{
        const userUpadate =  await Register.findOne({email: req.body.email});
        if(!userUpadate) (
        res.send(` you are not registered.` )
        ) 
        var randomVal =  f();
        if( !randomVal ){
           randomVal =  f() 
        }
        userUpadate.resetToken = randomVal;
        //user.isverified = true;
        
        const userReset =  await userUpadate.save();
        
        //temp line 
        
       // res.send(` Password Reset  Successfully <br>click on link for <a href="/">HOME</a>  `);
                const fmsg = {
                to: req.body.email,
                from: {
                    name:'Web Notes',
                    email:'ptu.project.6@gmail.com',
                }, 
                subject: 'Reset Your Notes Web App Password',
                text: `Hello ${userReset.first_name} ,  You are requested for reset password .
                    Please verify account
                    ${req.protocol}://${req.headers.host}/reset-password/${userReset.resetToken}`,
                html:`
                   <h1> Hello ${userReset.first_name} , You are requested for reset password </h1>
                   <p> Please verify account </p>
                   <div> <h2>OTP is</h2> <br> <strong> ${userReset.resetToken} </strong>  <br> please verify befor expire. </div>
                    `,
                };
                
                
                
                try {
                    await sgMail.send(fmsg);
                    // req.flash("SUS" ,"WOW") ;              
                    //res.status(201).render("notes");
                    res.status(201).render("reset-password");
                } catch (error) {
                    console.error(error);

                if (error.res) {
                        console.error(error.res.body)
                }
            }
    }catch(error){
       res.send(` something went wrong,please try after some time `);
        // req.flash("SUS" ,"WOW") ;              
      //  res.redirect('back');
        //res.status(400).send(error);
}
});



//   reset-password
app.post("/reset-password", async(req, res) => {
  
    try{
       // const userR = await Register.findOne({emailtoken: req.query.token});
        //console.log(`${userR}`);
        
        var userR = await Register.findOne({resetToken: req.body.resetToken});
        //console.log(`${userR}`);
        if(!userR) (
        res.send(` you are not registered.` )
        )
        try{
        const newpassC = req.body.password;
           //var timeCompare = rstpsdDateCheck();
           // console.log(timeCompare);
            //if(timeCompare == false){
              //  res.send(` Your Otp has been expired, <br> Please Genrate Otp again to reset password `);
              //  }
            try{
               const  newHashPass = await bcrypt.hash(newpassC , 10); 
            } catch(error){
                console.log(error);
                }
        const  newHashPass = await bcrypt.hash(newpassC , 10);
        userR.resetToken = null;
        userR.emailtoken = null;
        userR.isverified = true;
        userR.password = newHashPass;
        await userR.save();
        } catch(error){
            console.log(error);
            res.send(` something went wrong,please try after some time `);
        }
        //user.emailtoken = null;
        //user.isverified = true;
        //user.password = newHashPass;
        //await userR.save();
        res.send(` Password Reset  Successfully <br>click on link for <a href="/">HOME</a>  `);  //<a href="front">Home</a>
    } catch(error){
        //console.log(error);
        res.status(400).send('Something Went wrong , Please try after some time')
     //  res.send(` something went wrong,please try after some time `);
        // req.flash("SUS" ,"WOW") ;              
      //  res.redirect('back');
        //res.status(400).send(error);
}
});





//login check
app.post("/index" , async(req, res) => {
     try{
         const email = req.body.email;
         const ePassword = req.body.password;
         //const check =  typeof(email);
         //console.log(`${email} and ${phone}`);
         //if( check === Number){
             //const useremail = await Register.findOne({phone : email});
        // } else{
             const useremail = await Register.findOne({email: email}) || await Register.findOne({phone: email});
            // const useremail = await Register.findOne({phone: email});
        // }
         
         
         //res.send(useremail);
         //console.log(useremail.email);
         
         //compare hashpassword with entered password
         const passwordHash = useremail.password;
         const passwordMatch = await bcrypt.compare(ePassword , passwordHash);
         const verify = useremail.isverified;
          //console.log(verify);
         //console.log(`${passwordMatch}`);
         // 
       // const  loginMethod = passwordMatch && verify
       // console.log(loginMethod);
         
         const matched=(passwordMatch && verify);
         //console.log(`${matched}`);
         if( matched){
             req.flash('msg', 'you are already registered') ;
            // sessionStorage.setItem("flag", "true");
             req.session.isUser = useremail
             res.status(201).render("homeLogined");
         } else{
             res.status(403).send("Either Wrong Password <strong> or </strong><br>Your account is not verified,please go to email and veriy");
         }
     } catch (error){
         res.status(400).send('Something went wrong!. Please Try again');
}
});


app.post("/contact-us" , async(req ,res) => {
       try{
                const contactMsg = {
                to: 'ptu.project.6@gmail.com',
                from: {
                    name:'Web Notes',
                    email:'ptu.project.6@gmail.com',
                },
                subject: 'Help For Notes',
                text: `${req.body.first_name} is contacting for <br> ${req.body.subject}
                <br>
                <strong>Sender email</strong>
                ${req.body.email}
                `,
                html:`
                   ${req.body.first_name} is contacting for <br> ${req.body.subject} 
                    <br>
                <strong>Sender email</strong>
                ${req.body.email} 
                    `,
                };
           const contactMsgs = {
                to: req.body.email,
                from: {
                    name:'Web Notes',
                    email:'ptu.project.6@gmail.com',
                },
                subject: 'CONFIRMATION OF SEND MAIL FOR CONTACT US',
                text: ` ${req.body.first_name} , Our team will be send you response  within 2-3 working days. `,
                html:`
                   ${req.body.first_name} , Our team will be send you response  within 2-3 working days. 
                    `,
                };
            
                
                try { 
                    await sgMail.send(contactMsg);
                    await sgMail.send(contactMsgs);
                    /*alert('Thank you for contacting us ! Your message has been successfully sent.')*/
                    res.status(201).render("homeLogined");
                } catch (error) {
                    console.error(error);

                if (error.res) {
                        console.error(error.res.body)
                }
            }
           
       } catch(error) {
           console.log(error)
           res.send('Something Went wrong , Please try after some time')
       }
});




app.listen(port, () => {
   console.log(`server started `);
});