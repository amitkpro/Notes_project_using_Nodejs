
const f =function getRandomString(){
    var randomChr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    var length = 10;
    for(var i=0; i < length ; i++){
        result += randomChr.charAt(Math.floor(Math.random() * randomChr.length));
    
    }
    return result ;
}

//result = getRandomString();

//const Register = new("reset-password" , employeeSchema);

module.exports = f;