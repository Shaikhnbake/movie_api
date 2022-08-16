const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
// Automatically routes all requests for static files on server
app.use(express.static("public"));
//LOGGER
app.use(morgan("common"));

//parses incoming HTML body requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testssite.com'];
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

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');



let users = [
  {
    id: 1,
    username: "Jarjar",
    password: "123",
    email: "Jarjar@gmail.com",
    birthday: "01/01/2001",
    topMovies: [
      {
        title: "The Dark Knight",
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genre: {
          name: "Action",
          description:
            "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        year: "2008",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "Christopher Nolan",
          bio:
            "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England.",
          birthYear: "1970",
          deathYear: "N/A"
        }
      },
      {
        title: "Pulp Fiction",
        description:
          "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        genre: {
          name: "Drama",
          description:
            "The drama genre features stories with high stakes and a lot of conflicts. They’re plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters."
        },
        year: "1994",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "Quentin Tarantino",
          bio:
            "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee.",
          birthYear: "1963",
          deathYear: "N/A"
        }
      },
      {
        title: "Fight Club",
        description:
          "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
        genre: {
          name: "Action",
          description:
            "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        year: "1999",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "David Fincher",
          bio:
            "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley.",
          birthYear: "1962",
          deathYear: "N/A"
        }
      }
    ]
  },

  {
    id: 2,
    username: "Barbar",
    password: "123",
    email: "Barbar@gmail.com",
    birthday: "02/02/2002",
    topMovies: [
      {
        title: "The Lion King",
        description:
          "The Lion King tells the story of Simba (Swahili for lion), a young lion who is to succeed his father, Mufasa, as King of the Pride Lands; however, after Simba's paternal uncle Scar kills Mufasa to seize the throne, Simba is manipulated into thinking he was responsible and flees into exile.",
        genre: {
          name: "Comedy",
          description:
            "Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium."
        },
        year: "1994",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "Roger Allers",
          bio:
            "American film director, screenwriter, animator, storyboard artist, and playwright. He is most well known for co-directing The Lion King (1994), the highest-grossing traditionally animated film of all time, and for writing the Broadway adaptation of the same name. He also directed Sony Pictures Animation's first feature-length animated film, Open Season (2006).",
          birthYear: "1949",
          deathYear: "N/A"
        }
      },
      {
        title: "The Shawshank Redemption",
        description:
          "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre: {
          name: "Thriller",
          description:
            "Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
        },
        year: "1994",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "Frank Darabont",
          bio:
            "Three-time Oscar nominee Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution.",
          birthYear: "1959",
          deathYear: "N/A"
        }
      },
      {
        title: "The Dark Knight",
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genre: {
          name: "Action",
          description:
            "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        year: "2008",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "Christopher Nolan",
          bio:
            "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England.",
          birthYear: "1970",
          deathYear: "N/A"
        }
      }
    ]
  },
  {
    id: 3,
    username: "DuckLover1",
    password: "123",
    email: "DuckLover1@gmail.com",
    birthday: "03/03/2003",
    topMovies: [
      {
        title: "Fight Club",
        description:
          "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
        genre: {
          name: "Action",
          description:
            "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        year: "1999",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "David Fincher",
          bio:
            "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley.",
          birthYear: "1962",
          deathYear: "N/A"
        }
      },
      {
        title: "Inception",
        description:
          "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
        genre: {
          name: "Thriller",
          description:
            "Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
        },
        year: "2010",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "Christopher Nolan",
          bio:
            "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England.",
          birthYear: "1970",
          deathYear: "N/A"
        }
      },
      {
        title: "The Matrix",
        description:
          "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        genre: {
          name: "Action",
          description:
            "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
        },
        year: "1999",
        featured: "y/n",
        imgURL: " ",
        director: {
          name: "Lana Wachowski",
          bio:
            "Lana Wachowski and her sister Lilly Wachowski, also known as the Wachowskis, are the duo behind such ground-breaking movies as The Matrix (1999) and Cloud Atlas (2012).",
          birthYear: "1965",
          deathYear: "N/A"
        }
      }
    ]
  }
];

let movies = [
  {
    title: "The Lion King",
    description:
      "The Lion King tells the story of Simba (Swahili for lion), a young lion who is to succeed his father, Mufasa, as King of the Pride Lands; however, after Simba's paternal uncle Scar kills Mufasa to seize the throne, Simba is manipulated into thinking he was responsible and flees into exile.",
    genre: {
      name: "Family",
      description:
        "A family film is a film genre that contains children or relates to them in the context of home and family. Family films are made for a wider appeal with a general audience in mind. Family films come in several major genres like realism, fantasy, adventure, war, musicals, comedy, and literary adaptations."
    },
    year: "2008",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Roger Allers",
      bio:
        "American film director, screenwriter, animator, storyboard artist, and playwright. He is most well known for co-directing The Lion King (1994), the highest-grossing traditionally animated film of all time, and for writing the Broadway adaptation of the same name. He also directed Sony Pictures Animation's first feature-length animated film, Open Season (2006).",
      birthYear: "1949",
      deathYear: "N/A"
    }
  },
  {
    title: "Wall-E",
    description:
      "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
    genre: {
      name: "Family",
      description:
        "A family film is a film genre that contains children or relates to them in the context of home and family. Family films are made for a wider appeal with a general audience in mind. Family films come in several major genres like realism, fantasy, adventure, war, musicals, comedy, and literary adaptations."
    },
    year: "1994",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Andrew Stanton",
      bio:
        "Andrew Stanton has been a major creative force at Pixar Animation Studios since 1990, when he became the second animator and ninth employee to join the company's elite group of computer animation pioneers.",
      birthYear: "1965",
      deathYear: "N/A"
    }
  },
  {
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: {
      name: "Thriller",
      description:
        "Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
    },
    year: "1994",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Frank Darabont",
      bio:
        "Three-time Oscar nominee Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution.",
      birthYear: "1959",
      deathYear: "N/A"
    }
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    year: "2008",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Christopher Nolan",
      bio:
        "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England.",
      birthYear: "1970",
      deathYear: "N/A"
    }
  },
  {
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: {
      name: "Drama",
      description:
        "The drama genre features stories with high stakes and a lot of conflicts. They’re plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters."
    },
    year: "1994",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Quentin Tarantino",
      bio:
        "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee.",
      birthYear: "1963",
      deathYear: "N/A"
    }
  },
  {
    title: "Fight Club",
    description:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    genre: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    year: "1999",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "David Fincher",
      bio:
        "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley.",
      birthYear: "1962",
      deathYear: "N/A"
    }
  },
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    genre: {
      name: "Thriller",
      description:
        "Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety."
    },
    year: "2010",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Christopher Nolan",
      bio:
        "Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England.",
      birthYear: "1970",
      deathYear: "N/A"
    }
  },
  {
    title: "The Matrix",
    description:
      "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    genre: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    year: "1999",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Lana Wachowski",
      bio:
        "Lana Wachowski and her sister Lilly Wachowski, also known as the Wachowskis, are the duo behind such ground-breaking movies as The Matrix (1999) and Cloud Atlas (2012).",
      birthYear: "1965",
      deathYear: "N/A"
    }
  },
  {
    title: "Star Wars",
    description:
      "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
    genre: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    year: "1977",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "George Lucas",
      bio:
        "George Walton Lucas, Jr. was raised on a walnut ranch in Modesto, California. His father was a stationery store owner and he had three siblings. During his late teen years, he went to Thomas Downey High School and was very much interested in drag racing.",
      birthYear: "1944",
      deathYear: "N/A"
    }
  },
  {
    title: "Spirited Away",
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    genre: {
      name: "Family",
      description:
        "A family film is a film genre that contains children or relates to them in the context of home and family. Family films are made for a wider appeal with a general audience in mind. Family films come in several major genres like realism, fantasy, adventure, war, musicals, comedy, and literary adaptations."
    },
    year: "2001",
    featured: "y/n",
    imgURL: " ",
    director: {
      name: "Hayao Miyazaki",
      bio:
        "Hayao Miyazaki is one of Japan's greatest animation directors. The entertaining plots, compelling characters, and breathtaking animation in his films have earned him international renown from critics as well as public recognition within Japan.",
      birthYear: "1941",
      deathYear: "N/A"
    }
  }
];

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

// CREATE REQUESTS
app.post("/users", (req, res) => {
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
app.put('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
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
app.listen(8080, () => {
  console.log("Your app is now tuned into port 8080.");
});
