var express=require("express");
var router=express.Router();
var user=require('../models/user');
var jwt=require("jsonwebtoken");

router.get('/login',(req,res)=>{
    
    user.findOne({"_id":req.query.username,"password":req.query.password},(err,doc)=>{
       if(err)console.log(err); 

        if(doc)
        {   
        const token=jwt.sign(req.query.username,'123456');
           return  res.status(200).send({
                    success:'true',
                    message:'User available',
                    users:doc,
                    token:token
                    });
        }
        else
        {
            return res.send({
                    success:'false',
                    message:'User not available'
            });   
        }

      });
})


router.post('/register',(req,res)=>{
    if(!req.body._id){
        return res.send({
            success:'false',
            message:'Unsuccessful'
        });
    }
   else if(!req.body.name){
     return res.send({
            success:'false',
            message:'Unsuccessful'
        });
    }
    else if(!req.body.gender){
        return res.send({
               success:'false',
               message:'Unsuccessful'
           });
       } 
       else if(!req.body.designation){
        return res.send({
               success:'false',
               message:'Unsuccessful'
           });
       }
       else if(!req.body.password){
        return res.send({
               success:'false',
               message:'Unsuccessful'
           });
       }

       user.findOne({"_id":req.body._id},(err,doc)=>{
        if(err)console.log(err);

        if(doc)
        {
            return res.send({
                success:'false',
                message:'Email already exits'
            });
        }
        else
        {
            new user({
                _id:req.body._id,
                name:req.body.name,
                gender:req.body.gender,
                designation:req.body.designation,
                password:req.body.password
                }).save((err,doc)=>{
                    if(err) console.log(err);
                    else
                    {
                        res.status(200).send({
                            success:'true',
                            message:'Added Successfully',
                            users:doc
                        });
                    }
                });
        }
    });
})
module.exports=router;
