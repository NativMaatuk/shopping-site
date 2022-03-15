const { ObjectID } = require("bson");
const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

/**
 * @param {Products []} req.body.products
 * @param {Number} req.body.total
 */
 router.post('/createCart', (req, res) => {
    //TODO: need to check if exist
    const cart = new Cart({
        _id: new ObjectID(),
        products: [
            {  
                serialNumber: req.body.products[0].serialNumber,
                title: req.body.products[0].title,
                price: req.body.products[0].price,
                amount: req.body.products[0].amount
            }
        ],
        total: req.body.products[0].price
    })
    cart.save()
        .then(result => {
            res.send(result);
    })
    .catch(error => {
        console.log(error.message)
    })
});

router.get('/countCart', (req,res) => {
    console.log('count');
    Cart.count((error,data) => {
        if(error)
            res.json(1).end();
        else{
            res.json(data).end();
        }
    })
})

router.get('/getCarts', (req,res) => {
    Cart.find((error, data) => {
        if (error)
        res.status(400).json(err).end();
        else{
        res.json(data).end();
        }
    })
})


/**
 * push product to cart by serialNumber of cart
 * @param {Number} serialNumberCart
 * @param {Number} serialNumber
 * @param {String} title
 * @param {Number} price
 * @param {Number} amount
 */
router.put('/addToCart/:serialNumberCart', (req, res) => {
    //console.log(req.params);
    Cart.findOneAndUpdate(
        {serialNumberCart: req.params.serialNumberCart}, 
        { $push: {products: {"serialNumber": req.body.serialNumber, "title":req.body.title, "price": req.body.price, "amount": req.body.amount} }}, 
        (error, data) => {
            res.json(data);
        }
    )
})

/**
 * @param {Number} serialNumberCart
 * @param {Number} total
 */
router.put('/setTotal/:serialNumberCart', (req,res) => {
    //console.log(req.body.total);
    Cart.findOneAndUpdate(
        {serialNumberCart: req.params.serialNumberCart}, 
        { $set: {total: req.body.total}}, 
        (error, data) => {
            res.json(data);
        }
    )
})


router.delete('/emptyCart', (req, res) => {
    //TODO: add to the history collection before we empty cart collection
    Cart.deleteMany((error, data) => {
        //res.send('cart empty successfuly');
    })
})

module.exports = router;