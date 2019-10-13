const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe', {
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:10
    },
    imagePath:{
        type:String,
        required:true,
    },
    ingredients:[
        {
            ingName:{
                type:String,
                trim:true,
                required:true
            },
            ingAmount:{
                type:Number,
                min:1,
                required:true
            }
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

module.exports = Recipe;