const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { savedRedirectUrl } = require('../middleware.js');



router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});


router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        })
      
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")

    }

}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});




router.post("/login", savedRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
    async (req, res) => {
        req.flash("success", "Welcome to Wanderlust! You are logged in")
        let redirectUrl = res.locals.redirectUrl || "/listings";
        //this means aif there is any past path then redirect to it otherwise redirect to /listings
        res.redirect(redirectUrl);
    });

//logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "You are logged out")
        res.redirect("/listings");
    })
});


module.exports = router;