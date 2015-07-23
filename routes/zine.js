var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/zine_data')
var zineCollection = db.get('articles');

/* GET home page. */
router.get('/zine', function(req, res, next) { zineCollection.find({}, function (err, articles) {
  res.render('index', { zineCollection: articles  });
  });
});

router.get('/zine/new', function(req, res, next) {
  res.render('new');
});

router.post('/zine', function(req, res, next) {
  var checkbox = req.body.dark_colours;
  if (checkbox === "on") {
    checkbox = 'yes';
  } else {
    checkbox = "no";
  }
  zineCollection.insert({ title: req.body.title_name,
                          url: req.body.url_background,
                          checkbox: checkbox,
                          excerpt: req.body.excerpt_text,
                          body: req.body.body_text
  });
  res.redirect('/zine');
});

router.get('/zines/:id', function(req, res, next) {
  zineCollection.findOne({_id: req.params.id}, function (err, article) {
    res.render('show', {theZine: article});
  });
});

router.get('/zine/:id/edit', function(req, res, next) {
  zineCollection.findOne({ _id: req.params.id}, function (err, zine) {
    res.render('edit', {theZine: zine});
  });
});

router.post('/zine/:id/update', function(req, res, next) {
  zineCollection.update({ _id: req.params.id},
    { $set:
      { title: req.body.title_name,
        url: req.body.url_background,
        checkbox: checkbox,
        excerpt: req.body.excerpt_text,
        body: req.body.body_text }
  });
  res.redirect('/zine/' + req.params.id);
});

router.post('/zine/:id/delete', function(req, res, next) {
  zineCollection.remove({_id: req.params.id});
  res.redirect('/zine');
});

module.exports = router;
