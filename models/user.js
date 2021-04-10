var mongoose=require('mongoose');

var schema=new mongoose.Schema({
    "_id":String,
    "name":String,
    "gender":String,
    "designation":String,
    "password":String});

module.exports=mongoose.model('Users',schema);
