const express = require('express');
const res = require('express/lib/response');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const unless = require('express-unless');

const PORT = 3000;
let frenchMovies = [];

app.use('/public' ,express.static('public'));
//app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('views ongins', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

app.use(
    expressJwt(
    { secret: secret })
    .unless({ path: ['/', '/movies', '/movie-search', '/login']})
    );

app.get('/movie-search', (req, res) => {
    res.render('movie-search.ejs');
});

app.get('/movies', function(req, res){
    // res.send("Bientot des film ici mémé");
    const title = 'les films francais des trente dernier années';

    frenchMovies = [
        { title: 'Le fabuleaux destin d\'Amélie Poulain', year:2001 },
        { title: 'Buffet froit', year:1997 },
        { title: 'Le diner du cons', year:1998 },
        { title: 'De rouille et d\'os', year:2012 },
    ];
    res.render('movies.ejs', {movies:frenchMovies, title:title});
});

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body) {
        return res.sendStatus(500);

    } else {
        const formDate = req.body;
        console.log('formData: ', formDate);
        const newMovies = { title : req.body.movietitle, year : req.body.movieyear };
        frenchMovies = [...frenchMovies, newMovies];
        res.sendStatus(201);
    }
})

app.get('/movies/add', function(req, res){
    res.send('ajouter un film');
});

app.get('/movies/:id/:title', function(req, res){
    const id = req.params.id;
    const title = req.params.title;
    res.render('movie-details.ejs', {movieid:id, movietitle:title});
});

app.get ('/', function(req, res) {
    res.render('index.ejs');
});


app.get ('/login', function(req, res) {
    res.render('login.ejs', {title: 'Espace membre'});
});

const fakeUser = {email:'test@test.com', password:'aze'};

app.post('/login', urlencodedParser, function(req,res){
    // console.log('login post', req.body);
    if(!req.body){
        res.sendStatus(500);
    } else {
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jwt.sign({iss : 'http://expressmovies.fr', user: 'Anis', rolt: 'Modirateur'}, secret);
            res.json(myToken);
        } else {
            res.sendStatus(401);
        }
    }
});

app.get('/membre-only', function(req, res){
    console.log('req.user', req.user);
    res.send(req.user);
});

app.listen(3000, function(){
    console.log(`listing on port 3000 ${PORT}`);
});
