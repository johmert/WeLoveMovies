if (process.env.USER) require("dotenv").config();
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const express = require("express");

const theatersRouter = require("./theaters/theaters.router"); 
const moviesRouter = require("./movies/movies.router");

const app = express();

app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
