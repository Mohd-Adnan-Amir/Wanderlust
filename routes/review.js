const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require('../utils/ExpressError.js');


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//Review routes
router.post("/", validateReview, wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.reviews)
    //adding to review array in listing
    listing.reviews.push(newReview);

    //saving to DB
    await newReview.save()
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

}));

//delete a review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review reference from the listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete the actual review from Review collection
    await Review.findByIdAndDelete(reviewId);

    // Redirect back to listing
    res.redirect(`/listings/${id}`);
}));

module.exports = router;