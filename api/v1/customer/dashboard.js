const express = require('express');
const authorize = require('../../../middleware/authorize');
const router = express.Router();

router.post('/dashboard',authorize(['Customer']),(req,res)=>{
    res.status(200).json({message:'Welcom to Customer dashboard'});
});


module.exports = router;