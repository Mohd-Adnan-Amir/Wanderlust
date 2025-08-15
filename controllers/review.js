const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.createReview = async (req, res) => {

    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.reviews)
    newReview.author = req.user._id;

    //adding to review array in listing
    listing.reviews.push(newReview);

    //saving to DB
    await newReview.save()
    await listing.save();

    req.flash("success", "Review added.");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review reference from the listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete the actual review from Review collection
    await Review.findByIdAndDelete(reviewId);

    // Redirect back to listing
    req.flash("success", "Review deleted.");
    res.redirect(`/listings/${id}`);
}