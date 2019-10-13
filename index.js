require('./db/mongoose.js');
const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const recipeRouter = require('./routers/recipe.js');
const ingredientRouter = require('./routers/ingredient.js') ;
const userRouter = require('./routers/user.js');

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-type, Accept, Origin, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");

    next();
})

app.use(express.json());                  
app.use(recipeRouter);
app.use(ingredientRouter);
app.use(userRouter);


app.use(express.static(__dirname, "angular"));

app.use("/", (req,ress,next)=>{
    // res.sendFile(path.join(__dirname, "Recipe", "index.html"));
    res.json({"message":"working"})
})

app.listen(port, ()=>{
    console.log('app is listening on port : '+port);
}) 