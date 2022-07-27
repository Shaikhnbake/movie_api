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

let topMovies = [
  {
    title: "The Lion King",
    year: "1994"
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

//GET REQUESTS
app.get("/", (req, res) => {
  res.send("<h1>YOU LIKE MOVIES? I got movies for you!</h1>");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
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
