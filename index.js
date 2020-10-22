/**
 * * Copyright ©2020 Siddhartha Sarkar. All Rights Reserved
 *
 * ? This source code is licensed under the MIT license found in the
 * ? LICENSE file in the root directory of this source tree.
 */

//base
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

//express app
const app = express();

//load env. variables into config
require("dotenv").config();
const config = require("./config");

//routes
const {} = require("./routes");

//env. vars
const MONGODB_URI = config.mongodburi; //(or local url)
const PORT = process.env.PORT || 5000;

//connect to mongoDB
mongoose.connect(
  MONGODB_URI,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) =>
    err ? console.log("MongoDB Error:", err) : console.log("MongoDB Connected")
);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// express routes || app.use("/x", x)

//for development
if (process.env.NODE_ENV === "development") {
  app.get("/", (req, res) => {
    res.json({ message: "welcome dev environmment" });
  });
}

//for production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log("App listening at http://localhost:%d", PORT);
});
