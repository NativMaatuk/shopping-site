const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment'); // 1. require mongoose-auto-increment
const cart = require('./cart');


const Transaction = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        serialNumberTransaction: { type:Number, uniqued: true },
        cart: { 
            serialNumberCart:Number,
            products: [{serialNumber:Number,title:String,price: Number,amount: Number}],
            total: { type: Number }},
            date: { type: Date, required: true},
        },
        {
            collection:"history"
        }
);
autoIncrement.initialize(mongoose.connection); // 2. initialize autoIncrement 

Transaction.plugin(autoIncrement.plugin, {
    model: "transaction", // collection or table name in which you want to apply auto increment
    field: "serialNumberTransaction", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
  }); // 3. use autoIncrement

module.exports = mongoose.model("transaction",Transaction);