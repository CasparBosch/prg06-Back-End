const { application } = require('express');
const express = require('express')

const router = express.Router()

const Bike = require("../models/bikesModel");   

router.use(function (req, res, next){
    if (req.accepts('json')) {
        next();
    } else {
        res.status(400).send();
    }
});
router.get('/', async (req, res) => {
    console.log('GET')
    let total = await Bike.countDocuments()
    let start = parseInt(req.query.start)
    let limit = parseInt(req.query.limit) 

    if (isNaN(limit)) {
        limit = total
    }


    try {
        let bikes = await Bike.find()
        .skip(start - 1)
        .limit(limit)
    //create representation for collection as requested in assignment 
    //items, _links, paginations
    let bikesCollection = {
        items: bikes, 
        _links:{
            self:{
                href:`${process.env.BASE_URL}/`
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
                    href:`${process.env.BASE_URL}?start=1&limit=${limit}`  
                },
                previous:{
                    page: Math.ceil(start/limit) - 1,
                    href:`${process.env.BASE_URL}?start=${start - 1}&limit=${limit}`
                },
                next:{
                    page: Math.ceil(start/limit) + 1,
                    href:`${process.env.BASE_URL}?start=${start + 1}&limit=${limit}`
                },
                last:{
                    page: Math.ceil(total / limit),
                    href:`${process.env.BASE_URL}?start=${Math.ceil(total / limit)}&limit=${limit}`
                },
            }
        },
    }
        res.json(
            bikesCollection,
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
        let bike = await Bike.findById(req.params.id)
        if (bike == null){
            res.status(404).send()
        }else{
            res.json(bike)
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
    let bike = new Bike({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
    })

    try {
        await bike.save()
        res.status(201).send()
        res.json(bike)
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
        let bike = await Bike.findById(req.params.id)

        if(!bike){
            return res.json({
                message:"Bike ID does not exist",
            });
        } else{
            console.log('Bike Updated')
            let bikeUpdate = await Bike.findByIdAndUpdate(req.params.id, req.body,{
                new:true,
                runValidator:true
            });

            res.json({
                message: "Bike updated successflly.",
                bike: bikeUpdate
            })
        }
    }catch(error){
        next()

    }

})
  
router.delete("/:id", async (req, res) => {
    try {
        let bike = await Bike.findByIdAndDelete(req.params.id);
        if(bike === null){
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