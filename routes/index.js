const express = require('express');
const router = express.Router();

const simpleGit = require('simple-git')(process.env.PWD);

/* GET home page. */
router.get('/', function(req, res, next) {
  simpleGit.revparse(["--tags"], (err, tagShas) => {
    simpleGit.tags((err, tags) => {
      console.log('tags', tags, tagShas);
      res.render('index', {
        title: 'Express',
        tags,
      });
    });
  });
});

module.exports = router;
