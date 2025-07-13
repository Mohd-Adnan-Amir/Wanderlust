const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
            default: "https://unsplash.com/photos/man-sitting-on-rock-surrounded-by-water--Q_t4SCN8c4",
            set: (v) =>
                v === "" ? "https://unsplash.com/photos/man-sitting-on-rock-surrounded-by-water--Q_t4SCN8c4" : v,
        
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
//this contain the whole model of listing that means structure or schema of database model