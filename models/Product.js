const { Timestamp } = require('bson');
const { required, number } = require('joi');
const mongoose = require('mongoose');
const { type } = require('os');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String
    },
    stock:{
        type:Number,
        default:0
    },
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},
{
 Timestamp:true
});

module.exports = mongoose.model("Product",productSchema);