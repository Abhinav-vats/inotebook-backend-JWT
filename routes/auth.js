const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body ,  validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

// Create a User using POST "/api/auth ". Doesn't require auth and login    
router.post('/user', [
    body('email','Enter a valid email id').isEmail(),
    body('name', 'Enter a valid name').isLength({min:3}),
    body('password','Password length is less then 5').isLength({min:5})
],async (req, res)=>{
    try{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    

    // Check whether the user with the same email exits
    let getUser  = await User.findOne({email: req.body.email});
    if(getUser){
        return res.status(400).json({error: 'Sorry, a user with this email already exist.'})
    }
    //Insert new user Data in DB if user already do not exist

    const salt = await bcrypt.genSalt(10);

    const secPwd = await bcrypt.hash(req.body.password, salt);//req.body.password;
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPwd
    }).then((user)=>{
        res.json(user);
    }).catch((err)=>{
        res.send(err)
    });
    }catch(err){
        res.send(err)
    }
    
})


router.get('/user', (req, res)=>{
    User.find().then(users=> res.json(users)).catch(err=> res.json(err))
})


module.exports = router