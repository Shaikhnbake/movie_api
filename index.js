const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan");

const app = express();
// Automatically routes all requests for static files on server
app.use(express.static("public"));
//LOGGER
app.use(morgan("common"));

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    username: "Jarjar",
    password: "123",
    email: "",
    birthday: "",
    topMovies: []
  },

  {
    id: 2,
    username: "Barbar",
    password: "321",
    email: "",
    birthday: "",
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
    title: "Up",
    year: "2009"
  },
  {
    title: "The Emperor's New Groove",
    year: "2000"
  },
  {
    title: "Hercules",
    year: "1997"
  },
  {
    title: "Mulan",
    year: "1998"
  },
  {
    title: "Tarzan",
    year: "1999"
  },
  {
    title: "Aladdin",
    year: "1992"
  },
  {
    title: "The Dark Knight",
    year: "2008"
  },
  {
    title: "Angry Men",
    year: "1957"
  },
  {
    title: "Pulp Fiction",
    year: "1994"
  }
];

//GET (READ) REQUESTS
app.get("/", (req, res) => {
  res.send("<h1>YOU LIKE MOVIES? I got movies for you!</h1>");
});

app.get("/movies", (req, res) => {
  res.status(201).json(movies);
});

app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    return res.status(200).json(movie);
  } else {
    res.status(404).send("no movie found");
  }
});

app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name === genreName).genre;

  if (genre) {
    return res.status(200).json(genre);
  } else {
    res.status(404).send("no genre found");
  }
});

app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName)
    .director;

  if (director) {
    return res.status(200).json(director);
  } else {
    res.status(404).send("no director found");
  }
});

// CREATE REQUESTS
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.username) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  } else {
    res.status(400).send("Users need name");
  }
});

//UPDATE REQUESTS
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.username = updatedUser.username;
    res.status(200).json(user);
  } else {
    res.status(400).send("no user found");
  }
});

app.post("/users/:id/:title", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find(user => user.id == id);

  if (user) {
    user.topMovies.push(movieTitle);
    res
      .status(200)
      .send("${movieTitle} has been added to user ${id} movie list");
  } else {
    res.status(400).send("no user found");
  }
});

//DELETE REQUESTS

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send("${user} has been removed");
  } else {
    res.status(400).send("no user found");
  }
});

app.delete("/users/:id/:title", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find(user => user.id == id);

  if (user) {
    user.topMovies = user.topMovies.filter(title => title !== movieTitle);
    res
      .status(200)
      .send("${movieTitle} has been removed from user ${id} movie list");
  } else {
    res.status(400).send("no user found");
  }
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
