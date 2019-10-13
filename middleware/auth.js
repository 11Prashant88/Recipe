const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = async function(req,res,next)
{
    try
    {
        const token = req.header('Authorization').replace('bearer ', '');
        const decoded = jwt.verify(token, 'recipe-json-web-token');
        const user = await User.findOne({_id:decoded.id});
        if(!user)
        {
            throw new Error();
        }
        req.user = user
        next();
    }
    catch(e)
    {
        res.status(401).send({error:'authentication failed.'});
    }
    
}

module.exports = auth;