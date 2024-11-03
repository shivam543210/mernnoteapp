const express = require('express');
const router = express.Router();
const User = require('../modls/login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth, generateToken } = require('../middleware/jwt.js');

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send('Error registering user');
    }

});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password');
        }
        const token = generateToken({ userId: user._id });
       
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send('Error logging in user');

    }
})


module.exports = router;
