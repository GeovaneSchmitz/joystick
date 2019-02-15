var express = require('express');
var config = require('../config')

var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('list');
});



module.exports = router;
