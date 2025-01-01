const express = require('express');
const authorize = require('../../../middleware/authorize');
const router = express.Router();

router.post('/dashboard',authorize(['Vendor']),(req,res)=>{
    res.status(200).json({message:'Welcom to vendor dashboard'});
});


module.exports = router;