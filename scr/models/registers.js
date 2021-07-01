const mongoose = require("mongoose") ;
const bcrypt = require("bcryptjs") ;


const employeeSchema = new mongoose.Schema({
    first_name : {
        type : String,
        required : true
  },
    last_name :{
        type : String,
        required : true
},
phone :{
        type : Number,
        required : true ,
        unique :true
},
 password : {
        type : String,
        required : true                                  
 },
    email : {
        type : String,
        required : true ,   
        unique : true
    },
    rdiobtn :{
        type : String,
        required : true    
    },
    emailtoken :{
        type : String
        //required : true    
    },
    isverified :{
        type : Boolean
       // required : true ,   
    },
    resetToken :{
    type : String,   
    unique : true
},
   regiserTime :{
       type : Date
   },
    subject :{
        type : String
    }
    
                                          
});

//using middleware concept

//employeeSchema.pre("save" , async function(next) {
    //console.log( ${this.password } );
  //  this.password = await bcrypt.hash(this.password , 10);  // this.password use to get password
    //console.log( ${this.password } ) ;
   // next();
//} ) ;

//
// middlewearObj.isNotVerifed = async function(req, res, next){
  //  try{
//        const useremail = await Register.findOne({email: email});
     //   if(useremail.isverified){
         //   return next();
   //     }
    //    return( res.send(`please verify your account`) )

//}catch(error){
   // console.log(error);
    // res.send(`something went wrong`);
//}
//}


// now we need to create collections

const Register = new mongoose.model("Register" , employeeSchema);

module.exports = Register;

//employeeSchema.pre(before save function(in app) ,all function work)
//async function is used for synmontanouse done other work
                                                                //call hash asyn method , have salt rounds 10 is default 
                                                            // but can change. salt rounds =cost. increase+1 round=2*time
    
