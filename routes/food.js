var express = require('express');
var router = express.Router();

router.post('/create', function(req, res) {    
    res.json({type:true,data: 'response food create'}); 
});

module.exports = router;
