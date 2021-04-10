var express=require("express");
var router=express.Router();
var jwt=require("jsonwebtoken");
var user=require("../models/user");

router.get('/getId',(req,res)=>{
    const id=jwt.verify(req.query.token,'123456');
    
    user.findOne({"_id":id},(err,doc)=>{
        if(err) console.log(err);

        if(doc)
        {
            return  res.status(200).send({
                success:'true',
                message:'Id available',
                _id:id,
                designation:doc.designation
            });
        }
    });
});

module.exports=router;           