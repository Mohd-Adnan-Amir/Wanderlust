const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isloggedIn, isOwner, validateListing } = require('../middleware.js');
const multer  = require('multer')          
const upload = multer({ dest: 'uploads/' })

const listingController = require("../controllers/listing.js")




//index route
router.get("/", wrapAsync(listingController.index));


//new route
router.get("/new", isloggedIn, (listingController.renderNewForm));


//show route
router.get("/:id", wrapAsync(listingController.showListing));


//create routes-------{------middlewares--------}
// router.post("/", isloggedIn, validateListing, wrapAsync(listingController.createListing));
router.post("/", upload.single('listing[image]'), (req, res) => {
        res.send(req.file);
    })
    //concept use is all on multer npm website


//edit route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(listingController.renderEditForm));


//update 
router.put("/:id", isloggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


//delete route
router.delete("/:id", isloggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;