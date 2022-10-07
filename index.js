const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//LOCAL HOST SERVER
//  mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
//  });

const app = express();
// Automatically routes all requests for static files on server
app.use(express.static("public"));
//LOGGER
app.use(morgan("common"));

//parses incoming HTML body requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//validation middleware for username/password input
const {check, validationResult} = require('express-validator');


const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testssite.com', 'http://localhost:1234', 'https://myflix1ns.netlify.app'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    //if specific origin isnt found on list (=== -1)
    if(allowedOrigins.indexOf(origin) === -1){
      let message = 'The CORS policy for this application doesnt allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

//implements authorization code from local file
let auth = require('./auth')(app);

//authentication middleware = passport package
const passport = require('passport');
require('./passport');


//GET (READ) REQUESTS
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/", (req, res) => {
  res.send("<h1>YOU LIKE MOVIES? I got movies for you!</h1>");
});

app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
    .then((movies)=>{
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get("/movies/:title", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({title: req.params.title})
    .then((movie)=>{
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get("/movies/genres/:genre", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({"genre.name": req.params.genre})
    .then((movies)=>{
      res.status(201).json(movies.genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get("/movies/directors/:director", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'director.name': req.params.director})
    .then((movie)=>{
      res.status(201).json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) =>{
  Users.find()
    .then((users)=>{
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) =>{
  Users.findOne({username: req.params.username})
    .then((user)=>{
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// CREATE REQUESTS
app.post("/users",
  [ //validation logic for request
    check('username', 'Username is required (min 5 characters).').isLength({min: 5}),
    check('username', 'Username cannot have non alpha numeric characters.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email is not valid.').isEmail()
  ], (req, res) => {

    //checks validation objects for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + " already exists");
        } else {
          Users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
            .then((user) => {
              res.status(201).json(user)
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            })
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
  });

//UPDATE REQUESTS
app.put("/users/:username",
  [ //validation logic for request
    check('username', 'Username is required (min 5 characters).').isLength({min: 5}),
    check('username', 'Username cannot have non alpha numeric characters.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email is not valid.').isEmail()
  ], passport.authenticate('jwt', {session: false}), (req, res) => {

    //checks validation objects for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOneAndUpdate({ username: req.params.username }, { $set:
      {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username },
    { $addToSet: { topMovies: req.params.MovieID } },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//DELETE REQUESTS

app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
     $pull: { topMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//LISTENS FOR REQUESTS
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});
