const knex = require("../db/connection");

function destroy(reviewId) {
    return knex("reviews")
        .where({ review_id: reviewId })
        .del();
}

function read(reviewId) {
    return knex("reviews")
        .select("*")
        .where({ review_id: reviewId })
        .first();
}

function update(updatedReview) {
    return knex("reviews")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview)
        .returning("*");
}

module.exports = {
    delete: destroy,
    read,
    update,
}