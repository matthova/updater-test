const express = require('express');
const router = express.Router();

const git = require('simple-git')(process.env.PWD);

function createTagList() {
  return new Promise((r1, e1) => {
    git.tags(async (err, tags) => {
      // find the shas for each version
      const tagList = [];

      const tagArray = tags.all.map(tag => {
        return new Promise((r2, e2) => {
          git.revparse(['--verify', `${tag}^{commit}`], (err, result) => {
            const sha = result.split('\n')[0];
            tagList.push({ tag, sha });
            r2();
          });
        });
      });

      await Promise.all(tagArray);
      r1(tagList);
    });
  });
}

git.fetch(() => {
  /* GET home page. */
  router.get('/', async function(req, res, next) {
  // find all the versions
    const tagList = await createTagList();

    // find the current sha
    git.revparse(["HEAD"], (err, headSha) => {
      headSha = headSha.split('\n')[0];
      let version = undefined;

    // determine which version is associated with the current sha
      tagList.forEach(tagObject => {
        if (tagObject.sha === headSha) {
          version = tagObject.tag;
        }
      });

      // If on a non-tagged commit, then just call it "HEAD"
      if (!version) {
        version = headSha;
        tagList.push({
          tag: 'HEAD',
          sha: headSha.split('\n')[0],
        });
      }

      res.render('index', {
        title: 'Express',
        tags: tagList,
        version,
      });
    });
  });

  router.post('/update', async function(req, res, next) {
    const tagList = await createTagList();

    // check the sha received is a match
    const match = tagList.find(tag => {
      return tag.sha === req.body.version;
    });

    // if it is, then check out the sha
    if (match) {
      git.checkout(match.sha, (error, response) => {
        if (error) {
          return res.json({ error });
        }
        return res.redirect('/');
      });
    } else {
      return res.send('nope');
    }
  });
});

module.exports = router;
