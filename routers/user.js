const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth')
const userRouter = express.Router();

userRouter.post('/users', async (req,res)=>{
    try
    {
        const user = new User(req.body);
        await user.save();
        const token = user.generateAuthToken();
        res.status(201).send({token, expiresIn:3600});
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

userRouter.post('/users/login', async (req,res)=>{
    try
    {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = user.generateAuthToken();
        res.send({token, expiresIn:3600});
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

// userRouter.get('/users/logout', async (req,res)=>{
//     try
//     {
//         const users = await User.find({});
//         res.send(users);
//     }
//     catch(e)
//     {
//         res.status(500).send(e);
//     }
// })

userRouter.get('/users/me', auth, async (req,res)=>{
    res.send(req.user);
    // const id = req.params.id;

    // try
    // {
    //     const user = await User.findById(id);
    //     if(!user)
    //     {
    //         res.status(404).send();
    //     }
    //     res.send(user);
    // }
    // catch(e)
    // {
    //     res.status(500).send(e);
    // }
})

userRouter.patch('/users/me', auth, async (req, res)=>{
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidUpdate = updates.every((update)=>{
        return allowedUpdates.includes(update);
    })

    if(!isValidUpdate)
    {
        res.status(400).send({error:'invalid update'});
    }
    
    try
    {
        // const id = req.params.id;

        // const user = await User.findById(id);
        // if(!user)
        // {
        //     res.status(404).send();
        // }
        updates.forEach((item)=>{
            req.user[item] = req.body[item];
        })
        await req.user.save();
        res.send(req.user);
    }
    catch(e)
    {
        res.status(400).send(e);
    }

})

userRouter.delete('/users/me', auth, async (req,res)=>{
    // const id = req.params.id;
    try
    {
        await req.user.remove();
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user)
        // {
        //     res.status(404).send();
        // }
        res.send(req.user);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

module.exports = userRouter;