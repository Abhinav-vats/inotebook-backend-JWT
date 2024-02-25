
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()

const fetchuser = async (req, res, next) => {
    // Get the user from the jwt token and add id to the req  object
    if(!req.header('Authorization')){
        return res.status(401).json({ error: "Invalid token", errorCode: "UNAUTHORIZED", "status": 401 })
    }

    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({ error: "Invalid token", errorCode: "UNAUTHORIZED", "status": 401 })
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_SENTENCE);
        req.user = data.user

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token", errorCode: "UNAUTHORIZED", "status": 401 })
    }
}


module.exports = fetchuser;