// Required packages
var express = require('express');
var parser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

// Global instances
var app = express();
var router = express.Router();
var db = new sqlite3.Database('database.db');

// Setting up the db
db.run('\n\
    CREATE TABLE IF NOT EXISTS post(\n\
        id INTEGER PRIMARY KEY AUTOINCREMENT,\n\
        titolo TEXT NOT NULL,\n\
        testo TEXT NOT NULL\n\
    )', function(err) {
        if (err) return console.log(err.message);
    }
);

app.use(parser.json());
app.use(express.static('public'));

// Global variables
var path = __dirname + '/static';

// Logging method
router.use(function (req, res, next) {
    console.log('/' + req.method);
    next();
});

// Getting files
app.get('/:directory/:filename', function(req, res){
    console.log('Get file');
    res.sendFile(path + '/' + req.params.directory + '/' + req.params.filename);
});

// Getting fonts
app.get('/font/:directory/:filename', function(req, res){
    console.log('Get file');
    res.sendFile(path + '/font/' + req.params.directory + '/' + req.params.filename);
});

// Getting images
app.get('/img/:directory/:filename', function(req, res){
    console.log('Get file');
    res.sendFile(path + '/img/' + req.params.directory + '/' + req.params.filename);
});

// Getting pages
app.get('/', function(req, res){
    console.log('Get home page');
    res.sendFile(path + '/html/home.html');
});

app.get('/:page', function(req, res){
    console.log('Get page');
    res.sendFile(path + '/html/' + req.params.page + '.html');
});

// Posting and getting posts
app.post('/leggi_post', function(req, res) {
    console.log('Get all posts');
    db.all('\n\
        SELECT titolo, testo\n\
        FROM post\n\
    ', (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        return res.send(row);
    });
});

app.post('/invia_post', function(req, res){
    console.log('New post: ' + JSON.stringify(req.body));
    db.run('\n\
        INSERT INTO post (titolo, testo)\n\
        VALUES (?, ?)\n\
    ', [req.body.titolo, req.body.testo], function(err) {
            if (err) return console.log(err.message);
        }
    );
    return res.send({success: true});
});

// Using router
app.use('/', router);

// Starting server
app.listen(80, function() {
    console.log('App listening on port 80');
});
