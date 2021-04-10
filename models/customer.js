var mongoose=require('mongoose');

var schema=new mongoose.Schema({
    "email":String,
    "name":String,
    "salesrep":String,
    });

module.exports=mongoose.model('Customers',schema);
