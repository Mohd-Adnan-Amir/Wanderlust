const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main()
.then(() => {
    console.log("connection succesful")
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}















app.get("/", (req, res) => {
    res.send("Han bhai yhan bhi hun")
})
app.listen(8080, () => {
    console.log("Server chal rhhaaaaa");
})