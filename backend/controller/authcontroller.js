
const User = require('../modls/login');  
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/jwt');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid username or password');
        }
        const token = generateToken({ userId: user._id });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send('Error logging in user');
    }
};
