const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/recipes', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true}).then(()=>{
//     console.log('mongodb connected successfully.')
// }).catch(error=>{
//     console.log('error while connecting to mongodb server.')
// })

mongoose.connect("mongodb+srv://Prashant:SW2isUR9NmjMiyBz@recipecluster-pccbm.mongodb.net/recipes", {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log('mongodb connected');
})
.catch((e)=>{
    console.log('error while connecting to mongodb'+e);
})