const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require('../utils/ExpressError.js');
const { isloggedIn } = require('../middleware.js');

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));


//new route
router.get("/new", isloggedIn, wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you asked for dosen't exist.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}));


//create routes-------{------middlewares--------}
router.post("/", isloggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    req.flash("success", "New listing created.")
    res.redirect("/listings");
})
);


//edit route
router.get("/:id/edit", isloggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you asked for dosen't exist.");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));


//update 
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // res.redirect("/listings")
    req.flash("success", "Listing updated.");
    res.redirect(`/listings/${id}`);

}));


//delete route
router.delete("/:id", isloggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListingnpm)
    req.flash("success", "Listing deleted.");
    res.redirect("/listings")

}));

module.exports = router;