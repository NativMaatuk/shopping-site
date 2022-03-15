const {
    ObjectID
} = require("bson");
const express = require("express");
const moment = require("moment")
const cart = require("../models/cart");
const Transaction = require("../models/transaction");
const router = express.Router();


router.get('/getHistory', (req, res) => {
    Transaction.find((error, data) => {
        if (error)
            res.status(400).json(err).end();
        else {
            res.json(data).end();
        }
    })
})
router.get('/countTransaction', (req, res) => {
    Transaction.count((error, data) => {
        if (error)
            res.json(1).end();
        else {
            res.json(data).end();
        }
    })
})

router.get('/getFiveDays', (req, res) => {
    Transaction.find({
        date: {
            $gte: moment().add(-5, "days")
        }
    }, (error, data) => {
        res.json(data).end();
    })
})

/**
 * @param {cart} req.body.cart
 * @param {Date} req.body.date
 */

router.post('/createTransaction', (req, res) => {
    const transaction = new Transaction({
        _id: new ObjectID(),
        cart: {
            serialNumberCart: req.body.cart.serialNumberCart,
            products: req.body.cart.products,
            total: req.body.cart.total
        },
        date: req.body.date,
    })
    transaction.save()
        .then(result => {
            //console.log(result);
            res.send(result);
        })
        .catch(error => {
            console.log(error.message)
        })
})

module.exports = router;