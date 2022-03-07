const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    let theaters;
    if(res.locals.movie) {
        const movieId = res.locals.movie.movieId;
        theaters = await service.listByMovie(movieId);
    } else {
        theaters = await service.list();
    }
    res.json({ data: theaters });
}

module.exports = {
    list: asyncErrorBoundary(list),
}