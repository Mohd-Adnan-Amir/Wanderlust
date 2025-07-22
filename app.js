const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const Joi = require('joi');
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require('./models/review.js');



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for JSON
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Database connection
main()
    .then(() => {
        console.log("Database Connection Successful")
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URL);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//Routes-----
//initial route
app.get("/", (req, res) => {
    res.send("Server Working/ Roots")
})


const validateListing = (req, res, next) => {
     let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

const validateReview = (req, res, next) => {
     let { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}
//index route
app.get("/listings", wrapAsync (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

//new route
app.get("/listings/new", wrapAsync (async (req, res) => {
    res.render("listings/new.ejs");
}));

//show route
app.get("/listings/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("listings/show.ejs", { listing })
}));

//create routes-------{------middlewares--------}
app.post("/listings", validateListing, wrapAsync (async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
    
   })
);

//edit route
app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });
}));
//update 
app.put("/listings/:id", validateListing, wrapAsync (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings")

}));

//delete route
app.delete("/listings/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListingnpm)
    res.redirect("/listings")

}));

//Review routes

app.post("/listings/:id/reviews", validateReview, wrapAsync (async (req, res) => {

    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    //adding to review array in listing
    listing.review.push(newReview);

    //saving to DB
    await newReview.save()
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);

}));


// //initial route
// app.get("/", (req, res) => {
//     res.send("Server Working/ Browser on")
// })

app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message }); // You can change this to render an EJS view
});
app.listen(8080, () => {
    console.log("Server Running");
})