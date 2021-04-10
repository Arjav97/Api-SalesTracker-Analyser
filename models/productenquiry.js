var mongoose=require('mongoose');

var schema=new mongoose.Schema({
    "_id":String,
    "desc":String,
    "status":String,
    "salesrep":String,
    "date":Date,
    "datestring":String
    });

module.exports=mongoose.model('Productenquiry',schema);
