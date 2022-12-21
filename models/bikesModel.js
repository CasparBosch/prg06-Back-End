// Require Mongoose
const mongoose = require("mongoose");


// Define a schema
const Schema = mongoose.Schema;

const bikesSchema = new Schema({
  title: String,
  body: String,
  author: String,
}, { toJSON: {virtuals: true}});

//add virtual property to Bike, to include (dynamic) links
bikesSchema.virtual('_links').get(
    function(){
        return{
            self:{
                href:`${process.env.BASE_URL}/${this._id}`
            },
            collection:{
                href:`${process.env.BASE_URL}/`
            },
        }
    }
);

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Bike", bikesSchema);