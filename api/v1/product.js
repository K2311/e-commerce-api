const express = require('express');
const Joi = require('joi');
const Product = require('../../models/Product');
const authorize = require('../../middleware/authorize');

const router = express.Router();

const productSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Product name is required.',
    }),
    description: Joi.string(),
    price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a number.',
        'number.positive': 'Price must be greater than zero.',
        'any.required': 'Price is required.',
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Category is required.',
    }),
    stock: Joi.number().integer().min(0).messages({
        'number.base': 'Stock must be a number.',
        'number.integer': 'Stock must be an integer.',
        'number.min': 'Stock cannot be negative.',
    }),

});
router.post('/add',authorize(['Vendor']), async (req,res)=>{

    try {
        const { error ,value } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error:error.details[0].message});
        }

        const newProduct = new Product({
            ...value,
            vendor: req.user.id,
        });

        await newProduct.save();
        res.status(201).json({
            message: 'Product added successfully!',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }

});

router.get('/all', async (req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json({
            message: 'Products retrieved successfully!',
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Server error.',
            error: error.message,
        });
        
    }
});

module.exports = router;