# Airbnb
Wanderlust — A Mini Airbnb Clone
Wanderlust is a simple lodging listing platform built with Express.js, MongoDB, and EJS. Users can browse, create, edit, and delete property listings.
📁 Project Structure

wanderlust/
│
├── models/
│   └── listing.js
│
├── public/
│   └── (static files: CSS, JS, images)
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   └── error.ejs
│
├── app.js
└── README.md

🚀 Features
•	✅ View all property listings
•	➕ Add new listings
•	✏️ Edit existing listings
•	❌ Delete listings
•	⚠️ Graceful error handling with custom 404 and error pages
•	🎨 EJS templating with layout support via ejs-mate
🛠️ Tech Stack
•	Backend: Node.js, Express.js
•	Database: MongoDB with Mongoose
•	Templating: EJS + ejs-mate
•	Utilities: wrapAsync, ExpressError
•	Styling: Bootstrap 5 (or any static assets via public/)
📦 Installation & Setup
1.	1. Clone the repo:
   git clone https://github.com/your-username/wanderlust.git
2.	2. Install dependencies:
   npm install
3.	3. Run MongoDB locally (ensure it's running on mongodb://127.0.0.1:27017/wanderlust)
4.	4. Start the server:
   node app.js
5.	5. Open in browser:
   http://localhost:8080
📂 Key Files
app.js
Main server file that defines all routes, connects to MongoDB, and includes middleware.
wrapAsync.js

Wraps async route handlers to forward errors to the centralized error handler.
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

ExpressError.js

Custom error class used to throw HTTP errors with status codes.
class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = ExpressError;

🔒 Error Handling

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

🧪 Sample Route Highlights

// GET all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// CREATE new listing
app.post("/listings", wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

✍️ License
MIT License. Free to use and modify.
