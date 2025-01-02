const express = require('express');
const Joi = require('joi');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const authorize = require('../../middleware/authorize');

const router = express.Router();

const mongoose = require('mongoose');

const cartItemsSchema = Joi.array().items(
  Joi.object({
    productId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error('any.invalid', { value });
        }
        return value;
      })
      .required()
      .messages({
        'any.invalid': 'Product ID must be a valid ObjectId',
        'any.required': 'Product ID is required',
      }),
    quantity: Joi.number().integer().min(1).required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required',
    }),
    price: Joi.number().min(0).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be a positive value',
      'any.required': 'Price is required',
    }),
  })
).required().messages({
  'array.base': 'Items must be an array',
  'any.required': 'Items are required',
});
  

router.post('/',authorize(['Customer']), async (req,res)=>{
    try {
        const userId = req.user.id;
        const customerId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Add items before placing an order.' });
          }

          const normalizedItems = cart.items.map(item => ({
            productId: item.productId.toString(),
            quantity: item.quantity,
            price: item.price,
          }));

          const { error } = cartItemsSchema.validate(normalizedItems);

          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }

          const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

         const order = new Order({
            customerId, 
            items: cart.items,
            totalAmount,
            });

          await order.save();

          cart.items = [];
          await cart.save();
          res.status(200).json({ message: 'Order placed successfully.', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

module.exports = router;