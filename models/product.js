var mongoose=require('mongoose');

var schema=new mongoose.Schema({
    "_id":String,
    "name":String,
    "spec":String,
    "category":String,
    "qty":String,
    "price":String,
    "comm":String
    });

module.exports=mongoose.model('Products',schema);
