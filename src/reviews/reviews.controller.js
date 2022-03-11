const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function destroy(req, res, next) {
    service.delete(res.locals.review.review_id)
        .then(() => res.sendStatus(204))
        .catch(next); 
}

async function read(req, res) {
    res.locals.review.critic = await service.attachCritic(res.locals.review.critic_id);

    res.json({ data: res.locals.review });
}

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const review = await service.read(reviewId);
    if(review) {
        res.locals.review = review;
        return next();
    } else {
        next({
            status: 404,
            message: "Review cannot be found."
        });
    }
}

// update helper functions
const requiredProperties = ["score", "content"];
let score;
let content;

function hasOnlyRequiredProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(
        field => !requiredProperties.includes(field)
    );
    if(invalidFields.length) {
        return next({ status: 400, message: `Invalid field(s): ${invalidFields.join(", ")}` });
    }
    next();
}


async function update(req, res, next) {
    const updatedReview = {
        score: req.body.data.score ? req.body.data.score : res.locals.review.score,
        content: req.body.data.content ? req.body.data.content : res.locals.review.content,
        review_id: res.locals.review.review_id,
        movie_id: res.locals.review.movie_id,
        critic_id: res.locals.review.critic_id,
        created_at: res.locals.review.created_at,
        updated_at: res.locals.review.updated_at,
    }

    service.update(updatedReview)
        .then(data => service.attachCritic(updatedReview, updatedReview.critic_id))
        .then(data => res.json({ data }))
        .catch(next);
}

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), destroy],
    read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
    update: [
        asyncErrorBoundary(reviewExists),
        hasOnlyRequiredProperties,
        asyncErrorBoundary(update)
    ]
}