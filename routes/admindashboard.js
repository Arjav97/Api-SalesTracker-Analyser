var express=require("express");
var router=express.Router();
var order=require('../models/order');


router.get('/testing',(req,res)=>{
    //console.log('Working');
    
    order.aggregate([
        {
            $project:{
                month:{$substr:["$datestring",3,2]},
                ordertotal:1 
            }
        },

        {
            $group :{
                _id:"$month",total:{$sum:"$ordertotal"}
            }
        }
    ],(err,doc)=>{
        if(err) console.log(err);
       // console.log(doc);
    })
 
    
})




module.exports=router;
