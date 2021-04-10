var express=require("express");
var router=express.Router();
var product=require('../models/product');

router.get('/productcatalogue',(req,res)=>{

    product.find({},(err,doc)=>{
        
        if(err) console.log(err);
        
        if(doc)
        {
            return  res.status(200).send({
                success:'true',
                message:'Products Available',
                products:doc,
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'Products not available'
        });
        }
    });

    
});

router.get('/searchproduct',(req,res)=>{
    
    product.find({ $or: [{"name":req.query.pro},{"_id":req.query.pro}] },(err,doc)=>{
        if(err) console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                message:'Products Available',
                products:doc,
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'Product not available'
        });
        }
    })
});

router.get('/getCategories',(req,res)=>{
    product.find().distinct("category",(err,category)=>{
        if(err)console.log(err);
        if(category)
        {
            return res.send({
                categories:category
            })
        }
    });
})

router.get('/searchCategory',(req,res)=>{
    
    product.find({"category":req.query.category} ,(err,doc)=>{
        if(err) console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                message:'Products Available',
                products:doc,
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'Product not available'
        });
        }
    })
});

router.get('/getProduct',(req,res)=>{

    product.findOne({"_id":req.query.id},(err,doc)=>{
        if(err) console.log(err);

        if(doc)
        {
            return res.status(200).send({
                product:doc
            });
        }
    });
})

module.exports=router; 

