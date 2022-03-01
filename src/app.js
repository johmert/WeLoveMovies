if (process.env.USER) require("dotenv").config();
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const express = require("express");

const app = express();

app.use(express.json());
app.use(notFound);
app.use(errorHandler);

module.exports = app;
