const express = require('express');
const Ingredient = require('../models/ingredient');
const ingredientRouter = express.Router();
const auth = require('../middleware/auth');

ingredientRouter.post('/ingredients', auth, async (req,res)=>{
    const ingredient = new Ingredient({...req.body, owner:req.user._id});
    try
    {
        await ingredient.save();
        res.status(201).send(ingredient);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

ingredientRouter.post('/ingredients/multi', auth, async (req,res)=>{
    try
    {
        req.body.forEach((item)=>{
            item.owner = req.user._id;
        })
        const ingredients = await Ingredient.insertMany(req.body);
        res.status(201).send(ingredients);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})


ingredientRouter.get('/ingredients',auth, async (req,res)=>{
    try
    {
        // const ingredients = await Ingredient.find({owner:req.user._id})
        await req.user.populate('ingredients').execPopulate();
        res.send(req.user.ingredients);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

ingredientRouter.patch('/ingredients/:id', auth,  async (req,res)=>{
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['ingName', 'ingAmount'];
    const isValidUpdate = updates.every((update)=>{return allowedUpdates.includes(update)});

    if(!isValidUpdate)
    {
        res.status(400).send({error:"invalid update"});
    }

    try
    {
        // const ingredient = await Ingredient.findByIdAndUpdate(id, req.body, {new:true, runValidators:true});
        const ingredient = await Ingredient.findOne({_id:id, owner:req.user._id})
        if(!ingredient)
        {
            res.status(404).send();
        }
        res.send(ingredient);

    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

ingredientRouter.delete('/ingredients/:id', auth,  async (req,res)=>{
    const id = req.params.id;
    try
    {
        // const ingredient = await Ingredient.findByIdAndDelete(id);
        const ingredient = await Ingredient.findOneAndDelete({_id:id, owner:req.user._id})
        if(!ingredient)
        {
            res.status(404).send();
        }
        res.send(ingredient);
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})

module.exports = ingredientRouter;