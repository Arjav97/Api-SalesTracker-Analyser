var mongoose=require('mongoose');

var schema=new mongoose.Schema({
    "email":String,
    "salesrep":String,
    "desc":String,
    "date":Date,
    "datestring":String,
    "status":String
    });

module.exports=mongoose.model('Followups',schema);
