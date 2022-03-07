const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    let movies;
    if(req.query.is_showing) {
        movies = await service.listMoviesShowing();
    } else {
        movies = await service.list();
    }
    res.json({ data: movies });
}

// TODO: read function

module.exports = {
    list: asyncErrorBoundary(list)
}