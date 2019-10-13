const mongoose = require('mongoose');
const Ingredient = mongoose.model('Ingredient', {
    ingName:{
        type:String,
        required:true,
        trim:true,
    },
    ingAmount:{
        type:Number,
        min:1,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

module.exports = Ingredient;