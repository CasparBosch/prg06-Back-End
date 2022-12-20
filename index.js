//create webserver
const express = require('express');
const port = 8000

const bodyParcer = require('body-parser');

//load environment variables
require('dotenv').config();

//test
console.log(process.env.BASE_URI);

// Import the mongoose module
const mongoose = require("mongoose");
mongoose.set('strictQuery', false)

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/notes";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));


const app = express();

const notesRouter = require ('./routers/notesRouter')

//create route /
app.use('/', notesRouter)=

// start webserver on port 8000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})







// const express = require('express')
// const app = express()
// const port = 8000

// //Load enviroment variables
// // require('dotenv').config()


// console.log(process.env.BASE_URL)


// // Import the mongoose module
// const mongoose = require("mongoose");
// mongoose.set('strictQuery', false)

// // Set up default mongoose connection
// const mongoDB = "mongodb://127.0.0.1/notes";
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// // Get the default connection
// const db = mongoose.connection;

// // Bind connection to error event (to get notification of connection errors)
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

// const notesRouter = require('./routers/notesRouter')


// app.use('/notes/', notesRouter)

// app.listen(port, () => {

//   console.log(`Example app listening on port ${port}`)
// })