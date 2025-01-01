const express = require('express');
const authorize = require('../../../middleware/authorize');
const router = express.Router();

router.post('/dashboard',authorize(['Admin']),(req,res)=>{
    res.status(200).json({message:'Welcom admin'});
});


module.exports = router;