const express = require('express')
const app = express()
const port = 8000

const bodyParser = require('body-parser')

//Load enviroment variables  
require('dotenv').config()


console.log(process.env.BASE_URL)


// Import the mongoose module
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/bikes";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const bikesRouter = require('./routers/bikesRouter');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:'application/json'}))
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'POST');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});



app.use('/', bikesRouter);

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`);
})


