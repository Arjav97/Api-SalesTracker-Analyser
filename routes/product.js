var express=require("express");
var router=express.Router();
var product=require('../models/product');
var jwt=require("jsonwebtoken");

router.post('/entry',(req,res)=>{
    
    if(!req.body._id){
        return res.send({
            success:'false',
            message:'Unsuccessful'
        });
    }

   else if(!req.body.name){
     return res.send({
            success:'false',
            message:'Name is Required'
        });
    }

    else if(!req.body.spec){
        return res.send({
               success:'false',
               message:'Specifications are required'
           });
    }

    else if(!req.body.category){
        return res.send({
               success:'false',
               message:'Category is required'
           });
    }

    else if(!req.body.qty){
        return res.send({
               success:'false',
               message:'Qty is required'
           });
    }

    else if(!req.body.price){
        return res.send({
               success:'false',
               message:'Price is required'
           });
    }
    
    else if(!req.body.comm){
        return res.send({
               success:'false',
               message:'Commission is required'
           });
    }

        new product({
            _id:req.body._id,
            name:req.body.name,
            spec:req.body.spec,
            category:req.body.category,
            qty:req.body.qty,
            price:req.body.price,
            comm:req.body.comm
                }).save((err,doc)=>{
                    if(err) console.log(err);
                    else
                    {
                        res.status(200).send({
                            success:'true',
                            message:'Product Added Successfully',
                            product:doc
                        });
                    }
                });
        
        });
    
router.get('/addqty',(req,res)=>{
        
        if(!req.query.id){
            return res.send({
                success:'false',
                message:'Product Id is required'
            });
        }
       else if(!req.query.qty){
         return res.send({
                success:'false',
                message:'Quantity is required'
            });
        }
        else 
        {
            product.findOne({"_id":req.query.id},(err,doc)=>{
                if(err)console.log(err);
         
                 if(doc)
                 {   
                    let qty= (+(req.query.qty)+(+(doc.qty)));
                    
                    product.findOneAndUpdate({"_id":req.query.id},{"qty":qty},(err,doc)=>{
                    if(doc)
                        {   
                            return res.send({
                                success:'true',
                                message:'Quantity Added Successfully',
                                product:doc
                            });  
                        }
                    });
                }
                 else
                 {
                     return res.send({
                             success:'false',
                             message:'Product not available'
                     });   
                 }
         
        });
    }
});

router.get('/updateProduct',(req,res)=>{
    
        if(!req.query.id){
            return res.send({
                success:'false',
                message:'Product Id is required'
            });
        }
        else if(!req.query.price && !req.query.comm){
            return res.send({
                success:'false',
                message:'Price and Commission is required'
            });
        }
        else if(req.query.price && !(req.query.comm)){
            product.findOneAndUpdate({"_id":req.query.id},{"price":req.query.price},(err,doc)=>{
                if(doc)
                {   
                    return  res.status(200).send({
                        success:'true',
                        message:'Price is Updated Successfully',
                        product:doc
                        });
                }
                else{
                    return  res.status(200).send({
                        success:'false',
                        message:'Product Id is not available'
                        });
                }
            });
        }
        else if(!(req.query.price) && req.query.comm){
            product.findOneAndUpdate({"_id":req.query.id},{"comm":req.query.comm},(err,doc)=>{
                if(doc)
                {   
                    return  res.status(200).send({
                        success:'true',
                        message:'Commission is Updated Successfully',
                        product:doc
                        });
                }
                else{
                    return  res.status(200).send({
                        success:'false',
                        message:'Product Id is not available'
                        });
                }
            });
        }
        else
        {
            product.findOneAndUpdate({"_id":req.query.id},{"price":req.query.price,"comm":req.query.comm},(err,doc)=>{
                if(doc)
                {   
                    return  res.status(200).send({
                        success:'true',
                        message:'Price and Commission is Updated Successfully',
                        product:doc
                        });
                }
                else
                {
                    
                    return  res.status(200).send({
                        success:'false',
                        message:'Product Id is not available'
                        });
                    
                }
            });
        }
    
});

module.exports=router;
