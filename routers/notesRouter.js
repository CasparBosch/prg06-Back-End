// notes router
const { application } = require('express');
const express = require('express');

const router = express.Router();

// Create a SomeModel model just by requiring the module
const Note = require("../models/notesModel");

//create route /
router.get("/", async (req, res) => {
    console.log('GET');
    try {
    let notes = await Note.find();

    // create representation for collection as request in assignment
    // items, _links, pagination

    let notesCollection = {
        items: notes,
        _links: {
            self: {
                href: `$(process.env.BASE_URI)notes/`
              },
              collection: {
                href: `$(process.env.BASE_URI)notes/`
              }
        },
        pagination: "Checker test, voor andere keer"
    }

    res.json(notesCollection);
    } catch {
        res.status(500).send()
    }
})

// create route /

router.get("/:id", (req, res) => {

    // find(_id)
    console.log('GET')
    res.send(`${req.params.id}`);
})

// middleware checkt content-type
router.post("/", (req, res, next)  => {
console.log(req.header("Content-Type"))

    if (req.header("Content-Type") === "application/json"){
        next();
    } else{
        res.status(415).send();
    }
});

//create route /
router.post("/", async (req, res) => {
    console.log('POST request for collection /');

    //deze info moet uit request komen
    let note = new Note({
        title: 'test1',
        body: 'test1',
        author: 'test1'
    })

    try {
        await note.save();

        res.status(201).send();
        } catch {
            res.status(500).send()
        }
})

//create route /
router.delete("/", (req, res) => {
    console.log('DELETE');
    res.send(items);
})

//create route /
router.options("/", (req, res) => {
    console.log('OPTIONS');
    res.send(items);
})

module.exports = router ;