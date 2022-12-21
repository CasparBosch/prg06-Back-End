const { application } = require('express');
const express = require('express')

const router = express.Router()

const Note = require("../models/notesModel");   

router.use(function (req, res, next){
    if (req.accepts('json')) {
        next();
    } else {
        res.status(400).send();
    }
});
router.get('/', async (req, res) => {
    console.log('GET')
    let total = await Note.countDocuments()
    let start = parseInt(req.query.start)
    let limit = parseInt(req.query.limit) 

    if (isNaN(limit)) {
        limit = total
    }


    try {
        let notes = await Note.find()
        .skip(start - 1)
        .limit(limit)
    //create representation for collection as requested in assignment 
    //items, _links, paginations
    let notesCollection = {
        items: notes || {}, 
        _links:{
            self:{
                href:`${process.env.BASE_URL}notes/`
            },
        }, 
        pagination: { 
            currentPage: Math.ceil(start/limit),
            currentItems: limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            _links : {
                first:{
                    page: 1,
                    href:`${process.env.BASE_URL}notes?start=1&limit=${limit}`  
                },
                previous:{
                    page: Math.ceil(start/limit) - 1,
                    href:`${process.env.BASE_URL}notes?start=${start - 1}&limit=${limit}`
                },
                next:{
                    page: Math.ceil(start/limit) + 1,
                    href:`${process.env.BASE_URL}notes?start=${start + 1}&limit=${limit}`
                },
                last:{
                    page: Math.ceil(total / limit),
                    href:`${process.env.BASE_URL}notes?start=${Math.ceil(total / limit)}&limit=${limit}`
                },
            }
        },
    }
        res.json(
            notesCollection,
          )    
    }catch{
        res.status(500).send()
    }
});

//create route detail
router.get('/:id', async (req, res) => {
    //find(_id)
    console.log(`GET request for detail ${req.params.id}`)

    try {
        let note = await Note.findById(req.params.id)
        if (note == null){
            res.status(404).send()
        }else{
            res.json(note)
        }
    } catch{
        res.status(404).send
    }
});

//middleware checkt header content-type
router.post('/', (req, res, next) => {
    console.log(req.header("Accept"))
    
    if(req.header('Content-Type') === 'application/json' || 'application/x-www-form-urlencoded'){
        next();
    } else {
        res.status(415).send()
    }
});


//middleware     for empty posts
router.post('/', (req, res, next) => {
    console.log('POST Middleware to check for empty values')

    if (req.body.title && req.body.body && req.body.author){
        next();
    }else {
        res.status(400).send();
    }
    
});

router.post('/', async (req, res) => {
    console.log('POST')
    let note = new Note({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
    })

    try {
        await note.save()
        res.status(201).send()
        res.json(note)
    }catch{
        res.status(500).send()
    }
    
});

router.put('/:id', (req, res, next) => {
    console.log('PUT Middleware to check for empty values')

    if (req.body.title && req.body.body && req.body.author){
        next();
    }else {
        res.status(400).send();
    }
    
});

router.put('/:id', async function(req,res,next){
    console.log(`PUT request for detail ${req.params.id}`)
    try{
        let note = await Note.findById(req.params.id)

        if(!note){
            return res.json({
                message:"Note ID does not exist",
            });
        } else{
            console.log('Note Updated')
            let noteUpdate = await Note.findByIdAndUpdate(req.params.id, req.body,{
                new:true,
                runValidator:true
            });

            res.json({
                message: "Note updated successflly.",
                note: noteUpdate
            })
        }
    }catch(error){
        next()

    }

})
  
router.delete("/:id", async (req, res) => {
    try {
        let note = await Note.findByIdAndDelete(req.params.id);
        if(note === null){
            res.status(404).send();
        }
        res.status(204).send();
    } catch {
        res.status(404).send();
    }
});
  
router.options('/', (req, res) => {
    console.log(`OPTIONS`)
    res.setHeader("Allow", "GET, POST, OPTIONS");
    res.send();
});

router.options('/:id', (req, res) => {
    console.log(`detail OPTIONS`)
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
    res.send();
});





module.exports = router