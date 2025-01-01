const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../../models/User');


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

const registerSchema = Joi.object({
    username: Joi.string()
        .min(2)
        .max(20)
        .trim() 
        .required()
        .messages({
            'string.empty': 'Username is required.',
            'string.min': 'Username must be at least 2 characters long.',
            'string.max': 'Username cannot exceed 30 characters.',
        }),
    email: Joi.string()
        .email()
        .trim()
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please enter a valid email address.',
        }),
    password: Joi.string()
        .min(6)
        .max(50)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{6,}$'))
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password cannot exceed 50 characters.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }),
    role: Joi.string()
        .valid('Admin', 'Vendor', 'Customer')
        .required()
        .messages({
            'string.empty': 'Role is required.',
            'any.only': 'Role must be one of Admin, Vendor, or Customer.',
        }),
});
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;


        const { error } =  registerSchema.validate({username, email, password , role });
        if(error){
            return res.status(400).json({error:error.details[0].message});
        }
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        const savedUser = await newUser.save();
        console.log('Saved User:', savedUser);

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error occurred:', error); 
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .trim()
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Please enter a valid email address.',
        }),
    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password cannot exceed 50 characters.',
        }),
});
router.post('/login', async(req,res)=>{
    try {
        const { email, password } = req.body;

        const { error } =  loginSchema.validate({email, password  });
        if(error){
            return res.status(400).json({error:error.details[0].message});
        }

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username,role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return res.status(200).json({
            message: 'Login successful!',
            token, // Return the JWT token
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
    
});

module.exports = router;