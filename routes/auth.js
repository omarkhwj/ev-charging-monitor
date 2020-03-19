const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => { 
    //validate user input
    const {error} = registerValidation(req.body);
    if (error) 
        return res.status(400).send(error.details[0].message);
    
    //Check if user already exists
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) 
        return res.status(400).send('Email already in use');
    

    //Hash and salt password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User( {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPass

    });
    try {
        const savedUser = await user.save();
        res.send({user : savedUser._id});
    } catch(err) {
        res.status(400).send(err);

    }
}); 



router.post('/login', async (req, res) => {
    //validate user input
    const { error } = loginValidation(req.body);
    if(error)
        return res.status(400).send('Invalid email or password');

    //Check if user account exists
    const user = await User.findOne( { email : req.body.email });
    if (!user)
        return res.status(400).send('Invalid email or password');

    //Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass)
        return res.status(400).send('Invalid email or password');

    
    //Create and assign a token
    const token = jwt.sign({ _id : user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    
});

module.exports = router;