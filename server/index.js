const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false,
}));

const cors = require('cors');
app.use(cors());

//create the auto request logger.
const morgan = require('morgan');
app.use(morgan('dev'));

// mongoose conn
const mongoose = require("mongoose");
const mongoDB = "mongodb://localhost:27017/shopping-site";
mongoose.connect(mongoDB,{useNewUrlParser:true});



// routers
const productsRouter = require("./api/routes/products.route");
const cartsRouter = require("./api/routes/cart.route");
const transactionRouter = require("./api/routes/transaction.route");
app.use("/api/products",productsRouter);
app.use("/api/cart",cartsRouter);
app.use("/api/history",transactionRouter);

app.listen(PORT, () => console.log('Server started on port ', PORT));
