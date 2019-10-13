const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        unique:true,
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate:function(value)
        {
            if(!validator.isEmail)
            {
                throw new Error('Email is invalid.')
            }
        }
    },
    password:{
        type:String,
        minlength:8,
        validate:function(value)
        {
          if(value.includes('password'))
          {
            throw new Error('Password should not contain \'paasword\' phrase.')
          }
        }
    }
})

userSchema.virtual('recipes', {
    ref:'Recipe',
    localField:'_id',
    foreignField:'owner'
})

userSchema.virtual('ingredients', {
    ref:'Ingredient',
    localField:'_id',
    foreignField:'owner'
})

userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified)
    {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.statics.findByCredentials = async (email, password)=>
{
    const user = await User.findOne({email});
    if(!user)
    {
        throw new Error('Email Id doesn\'t exists');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
    {
        throw new Error('Password is incorrect');
    }

    return user;
}

userSchema.methods.generateAuthToken = function()
{
    const user = this;
    const token = jwt.sign({id:user._id}, 'recipe-json-web-token', {expiresIn:"1h"});
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;