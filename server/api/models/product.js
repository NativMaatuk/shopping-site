const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment'); // 1. require mongoose-auto-increment
const Product = new mongoose.Schema(
    {
    _id: mongoose.Schema.Types.ObjectId, 
    serialNumber: { type:Number, uniqued: true },
    title: { type: String,uniqued:false, required: true },
    price: { type: Number, required: true},
    description: { type: String, required: true, maxlength: 20 },
    image: { type: String, required: true }
    },
    {
        collection:"products"
    }
);

autoIncrement.initialize(mongoose.connection); // 2. initialize autoIncrement 

Product.plugin(autoIncrement.plugin, {
    model: "products", // collection or table name in which you want to apply auto increment
    field: "serialNumber", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
  }); // 3. use autoIncrement

module.exports = mongoose.model("products",Product);