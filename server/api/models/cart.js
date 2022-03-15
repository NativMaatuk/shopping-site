const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment'); // 1. require mongoose-auto-increment
const Cart = new mongoose.Schema(
    {
             _id: mongoose.Schema.Types.ObjectId,
             serialNumberCart:Number,
            products: [{serialNumber:Number,title:String,price: Number,amount: Number}],
            total: { type: Number }
    },
        {
            collection:"cart"
        }
);

autoIncrement.initialize(mongoose.connection); // 2. initialize autoIncrement 

Cart.plugin(autoIncrement.plugin, {
    model: "cart", // collection or table name in which you want to apply auto increment
    field: "serialNumberCart", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
  }); // 3. use autoIncrement

module.exports = mongoose.model("cart",Cart);