// Require Mongoose
const mongoose = require("mongoose");


// Define a schema
const Schema = mongoose.Schema;

const NotesSchema = new Schema({
  title: String,
  body: String,
  author: String,
}, { toJSON: {virtuals: true}});

//add virtual property to Note, to include (dynamic) links
NotesSchema.virtual('_links').get(
    function(){
        return{
            self:{
                href:`${process.env.BASE_URL}notes/${this._id}`
            },
            collection:{
                href:`${process.env.BASE_URL}notes/`
            },
        }
    }
);

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Note", NotesSchema);