const { ObjectID } = require("bson");
const express = require("express");
const router = express.Router();
const Product = require("../models/product");

/**
 * get all product from mongoDB
 * @param {string} req.param.title
 * @param {number} req.param.price
 * @param {string} req.param.description
 * @param {string} req.param.image
 */
router.get('/getProducts',(req,res)=>{
    Product.find((error,data)=>{
        if (error)
            res.status(400).json(err).end();
        else{
            res.json(data).end();
        }
            
    });
});

/**
 * get one product from mongoDB by serialNumber
 * @param {string} req.param.serialNumber
 */
router.get('/getProduct/:serialNumber', (req, res) => {
    Product.find({serialNumber: req.params.serialNumber}, (error, data) => {
        res.json(data).end();
    })
})

/**
 * add a new product to the mongoDB
 * @param {{title:string,price:Number,description:string,image:string}}
 */
router.post('/create', (req,res) => {
    //TODO: need to check if exist
    const product = new Product({
        _id: new ObjectID(),
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image
    })
    product.save()
        .then(result => {
            //console.log(result);
            res.send(result);
    })
    .catch(error => {
        console.log(error.message)
    })
})

/**
 * update one product by serialNumber
 * @param {string} req.param.serialNumber
 * @param {string} req.param.title
 * @param {number} req.param.price
 * @param {string} req.param.description
 * @param {string} req.param.image
 */
router.put('/update/:serialNumber', (req, res) => {
    Product.updateOne({serialNumber: req.params.serialNumber}, {$set: req.body},
        (error, data) => {
            res.json(data);
        }
        )
})

/**
 * remove product by serialNumber
 * @param {string} req.param.serialNumber
 */
router.delete('/delete/:serialNumber', (req,res) => {
    Product.findOneAndRemove({serialNumber: req.params.serialNumber}, (error,data) => {
        //console.log('product removed')
        res.send('product removed')
    })
})

module.exports = router;