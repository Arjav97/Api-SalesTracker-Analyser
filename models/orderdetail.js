var mongoose=require('mongoose');

var schema=new mongoose.Schema({
    "_id":String,
    "orderId":String,
    "product":String,
    "qty":Number,
    "subtotal":Number,
    "orderdate":Date,
    "datestring":String,
    "salesrep":String,
    "customer":String
    });

module.exports=mongoose.model('Orderdetail',schema);

    