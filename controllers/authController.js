require('mongoose');
const Usr = require('../models/userModel');
const jwt = require('jsonwebtoken');

const {SECRET} = require('../utils/config');


const login = async(email,password) => {

    const cryptoPass = require('crypto')
        .createHash('sha256')
        .update(password)
        .digest('hex');

    const  result = await Usr.findOne({ email: email, isActive:true, password:cryptoPass })
    
    if (result){
            // retorno token
            //jwt.sign('payload','secret_key','options'
            const token = jwt.sign({ userId: result._id }, SECRET, { expiresIn: '1h' });
            return token;
    }
    return null; // retorno 

}

module.exports = {login}