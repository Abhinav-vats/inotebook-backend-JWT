const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fetchuser = require('../middleware/fetchuser');

dotenv.config()


// ROUTE 1: Create a User using POST "/api/auth/user ". Doesn't require login    
router.post('/user', [
    body('email', 'Enter a valid email id').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password length is less then 5').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Check whether the user with the same email exits
        let getUser = await User.findOne({ email: req.body.email });
        if (getUser) {
            return res.status(400).json({ error: 'Sorry, a user with this email already exist.' })
        }

        //Genrating Salt
        const salt = await bcrypt.genSalt(10);
        // Genrating Hash from salt and data
        const secPwd = await bcrypt.hash(req.body.password, salt);

        //Insert new user Data in DB if user already do not exist
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPwd
        })

        // Generate sign
        const data = {
            user: {
                id: user.id
            }
        }

        const token = jwt.sign(data, process.env.SECRET_SENTENCE);
        res.json({ token });

    } catch (err) {
        if (err.status != null && err.status != undefined) {

            res.status(err.status).json(err)
        } else
            res.status(500).send({ error: "INTERNAL SERVER ERROR" })
    }

})

// ROUTE 2: Authenticate a User using POST "/api/auth/login ". Doesn't require login    
router.post('/login', [
    body('email', 'Enter a valid email id').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if (!user) {
            //throw ({ error: "Please try to login using correct credentials", errorCode: "WRONG_CREDENTIALS", status: 404 })
            return res.status(404).json({ error: "Please try to login using correct credentials", errorCode: "WRONG_CREDENTIALS", "status": 404 })
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            //throw ({ error: "Please try to login using correct credentials", errorCode: "WRONG_CREDENTIALS", status: 404 });
            return res.status(404).json({ error: "Please try to login using correct credentials", errorCode: "WRONG_CREDENTIALS", "status": 404 })
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const token = jwt.sign(data, process.env.SECRET_SENTENCE, {expiresIn: 30});
        res.json({ token });

    } catch (err) {
        if (err.status != null && err.status != undefined) {

            res.status(err.status).json(err)
        } else
            res.status(500).send({ error: "INTERNAL SERVER ERROR" })
    }

})

// ROUTE 3: Get Loggin User detail using GET :"/api/auth/getuser". Login required.

router.get('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;

        const user = await User.findById(userId).select(["-password", "-timestamp", "-__v", "-_id"]);
        res.json(user)
    } catch (err) {
        if (err.status != null && err.status != undefined) {

            res.status(err.status).json(err)
        } else
            res.status(500).send({ error: "INTERNAL SERVER ERROR" })
    }

})


module.exports = router