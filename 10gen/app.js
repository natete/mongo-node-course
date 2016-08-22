/**
 * Created by natete on 03/08/16.
 */
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(errorHandler);

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('errorTemplate', {error: err});
}


MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
    assert.equal(null, err);
    console.log('Successfully connected to MongoDB');

    app.get('/', function(req, res) {
        db.collection('movies').find({}).toArray(function (err, docs) {
            res.render('movies', {'movies': docs});
        });
    });

    //app.get('/:name', function (req, res, next) {
    //    var templateInfo = {};
    //    templateInfo.params ={};
    //    templateInfo.name = req.params.name;
    //    templateInfo.params.getParam1 = req.query.getParam1;
    //    templateInfo.params.getParam2 = req.query.getParam2;
    //
    //    res.render('names', templateInfo);
    //});

    app.get('/fruitsPicker', function (req, res) {
        var fruits = ['apple', 'banana', 'orange', 'peach'];
        res.render('fruitsPicker', {fruits: fruits});
    });

    app.post('/favoriteFruit', function (req, res, next) {
        var favorite = req.body.fruit;
        if (typeof favorite === 'undefined') {
            next(Error('Please choose a fruit'));
        } else {
            res.send('Your favorite fruit is ' + favorite);
        }
    });

    app.get('/movieForm', function (req, res, next) {
        res.render('movieForm');
    });

    app.post('/movies', function (req, res, next) {
        var movie = {
            title: req.body.title,
            year: req.body.year,
            imdb: req.body.imdb
        };

        db.collection('movies').insertOne(movie);

        res.redirect('/');
    });

    app.use(function(req, res) {
        res.sendStatus(404);
    });

    var server = app.listen(3000, function () {
        var port = server.address().port;
        console.log('Express server listening on port %s', port);
    });
});
