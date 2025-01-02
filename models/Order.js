const { required } = require('joi');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    customerId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'User',
        required: true,
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Pending','Processing','Shipped','Delivered','Cancelled'],
        default:'Pending'
    }
},
{
    timeseries:true
});

module.exports = mongoose.model("Order",orderSchema);