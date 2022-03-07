const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: route for get /movies/:movieId

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;