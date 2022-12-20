// File: ./models/somemodel.js

// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: String,
  body: String,
  author: String
}, {toJSON: {virtuals: true}});

// Add virtual property to Note, to include (dynamic links)
NoteSchema.virtual('_links').get(
  function (){
    return{
      self: {
        href: `${process.env.BASE_URI}notes/${this._id}`
      },
      collection: {
        href: `${process.env.BASE_URI}notes/`
      },
    }
  }
)
// Export function to create "SomeModel" model class
module.exports = mongoose.model("Note", NoteSchema);
