const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

function generateToken(user) {
    return jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
}

async function register(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        res.json({ auth: true, token: generateToken(user) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const passwordValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordValid) return res.status(401).json({ auth: false, token: null });
        res.json({ auth: true, token: generateToken(user) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

function logout(req, res) {
    res.json({ auth: false, token: null });
}

module.exports = { register, login, logout };
