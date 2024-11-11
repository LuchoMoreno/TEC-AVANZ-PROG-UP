const mongoose = require('mongoose');
const User = require('../models/userModel');

const { NotFoundError, NotAcceptableError } = require('../utils/errors');


const getAllUsers = async (limit,offset) => {

    //const users = await User.find({}).limit(limit).skip(offset).populate('bets');
    const users = await User.find({}).limit(limit).skip(offset);
    return users;
}

const getUser = async(id) => {

    //const user = await User.findById(id).populate('bets');
    const user = await User.findById(id);

    return user;
}


const addUser = async (name,lastname,email,isActive,password) => {

    let existUser = await User.findOne({ email: email });
   
    if(!existUser) {

        const cryptoPass = require('crypto')
        .createHash('sha256')
        .update(password)
        .digest('hex');
        
        const newUser = new User(
            {              
                name: name,
                lastname:lastname,
                email: email,
                isActive:isActive,
                password:cryptoPass
            }
        );

        let user = await newUser.save(); 
        console.log("usuario nuevo");
        console.log(user);
        return { user }; 

    }else{
        return false;
    }
}   


const editUser = async(user) => {

    const result = await User.findByIdAndUpdate(user._id,user,{new:true});

    return result;
}


const editRoles = async(roles,id) => {

    const result = await User.findByIdAndUpdate(id,{$set:{roles:roles}},{new:true});

    return result;
}


const deleteUser = async(id) => {

    // Verifica si el ID del usuario es valido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotAcceptableError("El ID de usuario proporcionado no es válido.");
      }
      
    // Verifica si el usuario existe
    const userExist = await User.findById(id);
    if (!userExist) { 
        throw new NotFoundError("No existe ningun usuario registrado con ese ID.");
    }

    const result = await User.findByIdAndDelete(id);

    return result;
}


module.exports = { addUser, getAllUsers, getUser, editUser, editRoles, deleteUser}