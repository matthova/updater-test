const express = require('express');
const router = express.Router();

const git = require('simple-git')(process.env.PWD);

/* GET home page. */
router.get('/', function(req, res, next) {
// find all the versions
// find the shas for each version
// associate the shas with each version
//
// find the current sha
// determine which version is associated with the current sha

// find all the versions
  git.tags((err, tags) => {
// find the shas for each version
    git.revparse(['--tags'], (err, tagShas) => {
      tagShas = tagShas.split('\n');
      tagShas.pop(); // remove excess space
      if (tags.all.length !== tagShas.length) {
        throw new Error('Git error. Should be equal number tags and tag SHAs');
      }
      const versionList = [];
// associate the shas with each version
      for (let i = 0; i < tagShas.length; i++) {
        versionList.push({
          version: tags.all[i],
          sha: tagShas[i],
        });
      }

// find the current sha
      git.revparse(["HEAD"], (err, headSha) => {
        let version = undefined;

// determine which version is associated with the current sha
        versionList.forEach(version => {
          if (version.sha === headSha) {
            version = version.version
          }
        })

        if (!version) {
          version = headSha;
          versionList.push({
            version: 'HEAD',
            sha: headSha,
          });
        }

        res.render('index', {
          title: 'Express',
          tags: versionList,
          version,
        });
      });
    });
  });
});

module.exports = router;
