const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe')
const auth = require('../middleware/auth');

router.post('/recipes', auth,  async (req,res)=>{
    const recipe = new Recipe({...req.body, owner:req.user._id});
    try
    {
        await recipe.save();
        res.status(201).send(recipe);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

router.get('/recipes', auth, async (req,res)=>{
    try
    {
        // const recipes = await Recipe.find({owner:req.user._id});
        await req.user.populate('recipes').execPopulate();
        res.send(req.user.recipes);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

router.get('/recipes/:id', auth, async (req,res)=>{
    const id = req.params.id;
    try
    {
        const recipe = await Recipe.findOne({_id:id, owner:req.user._id});
        if(!recipe)
        {
            return res.status(404).send();
        }
        res.send(recipe);

    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

router.patch('/recipes/:id', auth, async (req,res)=>{

    console.log('recipe body : ' + req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'imagePath', 'ingredients']

    const isValidUpdate = updates.every((update)=>{return allowedUpdates.includes(update)})

    if(!isValidUpdate)
    {
        res.status(400).send({error:'Invalid Update'})
    }

    const id = req.params.id;
    try
    {
        
        // const recipe = await Recipe.findById(id);
        const recipe = await Recipe.findOne({_id:id, owner:req.user._id})
        if(!recipe)
        {
            res.status(404).send();
        }
        updates.every((update)=>{
            recipe[update] = req.body[update];
        })
        await recipe.save();
        
        res.send(recipe);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

router.delete('/recipes/:id', auth, async (req,res)=>{
    const id = req.params.id;
    try
    {
        // const recipe = await Recipe.findByIdAndDelete(id);
        const recipe = await Recipe.findOneAndDelete({_id:id, owner:req.user._id})
        if(!recipe)
        {
            res.status(404).send(recipe);
        }
        res.send(recipe);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

// {
// 	"name":"Cheese sandwich",
// 	"description":"Cheesy grilled sandwiches with indian spices.",
// 	"imagePath":"https://i.ndtvimg.com/i/2016-06/sandwich_625x350_61467126370.jpg",
// 	"ingredients":[
// 		{
// 			"ingName":"Potato",
// 			"ingAmount":"3"
// 		},
// 		{
// 			"ingName":"Cheese",
// 			"ingAmount":"1"
// 		}
// 	]
// }

module.exports = router;