const express = require('express');
const router = express.Router();
const package = require('../package.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    version: package.version,
  });
});

module.exports = router;
