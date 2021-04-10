var mongoose=require('mongoose');

var schema=new mongoose.Schema({
    "_id":String,
    "salesrep":String,
    "customer":String,
    "orderdate":Date,
    "datestring":String,
    "commission":Number,
    "ordertotal":Number
    });

module.exports=mongoose.model('Orders',schema);
