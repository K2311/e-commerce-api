const express = require('express');
const authorize = require('../../middleware/authorize');
const Cart = require('../../models/Cart');
const User = require('../../models/User');
const Joi = require('joi');
const router = express.Router();

const cartItemSchema = Joi.object({
    productId: Joi.string().required().messages({
        'string.base': 'Item ID must be a string',
        'any.required': 'Item ID is required'
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required'
      }),
      price: Joi.number().min(0).required().messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be a positive value',
        'any.required': 'Price is required'
      })
});
router.post('/',authorize(['Customer']), async(req,res)=>{
    try {
        const { error } = cartItemSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }

        const userId = req.user.id;
        const { productId, quantity, price } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
          }
          const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
          if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
          } else {
            cart.items.push({ productId, quantity, price });
          }

          cart.updatedAt = new Date();
          await cart.save();
          res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            message: 'Server error.',
            error: error.message,
        });
    }
});

module.exports = router;