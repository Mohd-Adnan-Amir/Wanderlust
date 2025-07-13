const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
main()
    .then(() => {
        console.log("connection succesful")
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URL);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



//Routes-----
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
});

app.get("/listings/new", async (req, res) => {
    res.render("listings/new.ejs");
});


app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
});
 
app.post("/listings", async (req, res) => {
    // let {title, description, image,price, location, country} = req.body;
    // let listing = req.body;
    const newListing = new Listing(req.body.listing)
     await newListing.save();
   res.redirect("/listings");
});





app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings")
    
});

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listings")
    
});




// app.get("/testListings",  async (req, res) => {
//    let sampleListing = new Listing({
//     title: "My new villa",
//     description : "Han bhai hai villa",
//     price: 400,
//     location : "calcutta",
//     country : "india"

//    })
//    await sampleListing.save();
//    console.log("saved")
//    res.send("seccessfull");
// })


app.get("/", (req, res) => {
    res.send("Han bhai yhan bhi hun")
})
app.listen(8080, () => {
    console.log("Server chal rhhaaaaa");
})