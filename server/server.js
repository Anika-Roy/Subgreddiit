// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config({ path: "./config.env" });
// const port = process.env.PORT || 5000;
// app.use(cors());
// app.use(express.json());
// app.use(require("./routes/record"));
// // get driver connection
// const dbo = require("./db/conn");
 
// // const usersRouter = require("./routes/users");
// // app.use("/users", usersRouter);

// app.listen(port, () => {
//   // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
 
//   });
//   console.log(`Server is running on port: ${port}`);
// });

// -------------------------------------------------
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

require('dotenv').config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;

const uri = 'mongodb://mongo:27017/greddiit';

mongoose.connect(uri, { useNewUrlParser: true}
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
//user routes
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);
//post routes
const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);
//subgreddiit routes
const mysubgreddiitRouter = require("./routes/subgreddiits");
app.use("/subgreddiits", mysubgreddiitRouter);
//reports routes
const reportsRouter = require("./routes/reports");
app.use("/reports", reportsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});