// otp reset time 
const mongoose = require("mongoose") ;
//const Register = require(__dirname ,  "../models/registers");


const rstpsdDateCheck =function dateCompare(){
    console.log(this.rstPwdExpire)
    var first_date = new Date(this.rstPwdExpire);
    var current_date = new Date();
    console.log(current_date.getTime() );
    console.log(first_date.getTime() );
    if( first_date.getTime() > current_date.getTime() ){
        var result = true;
    } else{
        var result = false;
    }
    
    return result ;
}

module.exports = rstpsdDateCheck;