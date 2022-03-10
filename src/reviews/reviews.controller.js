const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function destroy(req, res, next) {
    service.delete(res.locals.review.review_id)
        .then(() => res.sendStatus(204))
        .catch(next); 
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

function hasRequiredProperties(req, res, next) {
    const { data = {} } = req.body;
    
    try{
        requiredProperties.forEach(property => {
            if(!data[property]) {
                const error = new Error (`A '${property}' property is required.`);
                error.status = 400;
                throw error;
            }
        });
        next();
    } catch (error) {
        next(error);
    }
}

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
        ...req.body.data,
        review_id: res.locals.review.review_id
    }
    service.update(updatedReview)
        .then(data => res.json({ data }))
        .catch(next);
}

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), destroy],
    update: [
        asyncErrorBoundary(reviewExists), 
        hasOnlyRequiredProperties, 
        hasRequiredProperties, 
        asyncErrorBoundary(update)
    ]
}