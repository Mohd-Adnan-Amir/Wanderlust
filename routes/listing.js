const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isloggedIn, isOwner, validateListing } = require('../middleware.js');
const multer  = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

const listingController = require("../controllers/listing.js")




//index route
router.get("/", wrapAsync(listingController.index));


//new route
router.get("/new", isloggedIn, (listingController.renderNewForm));


//show route
router.get("/:id", wrapAsync(listingController.showListing));


//create routes-------{------middlewares--------}
router.post("/", isloggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));

    //concept use is all on multer npm website


//edit route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(listingController.renderEditForm));


//update 
router.put("/:id", isloggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


//delete route
router.delete("/:id", isloggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;