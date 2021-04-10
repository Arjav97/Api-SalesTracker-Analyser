var express=require("express");
var router=express.Router();
var product=require('../models/product');
var order=require('../models/order');
var orderdetail=require('../models/orderdetail');


router.get('/productremaining',(req,res)=>{
    product.find({},(err,doc)=>{
        if(err)console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                message:'Products Found',
                products:doc
            });
        }
        else
        {
            return res.send({
                success:'false',
                message:'No Products Found'
            });
        }
    })
});



router.get('/productconsumptionforAdmin',(req,res)=>{

    orderdetail.aggregate([
        {
            $match : {
               
                $and: [
                    {orderdate:{ $gte:new Date(req.query.date1)}},
                    {orderdate:{ $lte:new Date(req.query.date2)}}
                    ]
            }
        },
        {
            $group : {
               
                 _id:"$product",qty:{ $sum:"$qty"}
            }
        },
        {
            $sort : {
                qty : -1
            }
        }
    
    ],(err,doc)=>{
        
        if(err) console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                doc:doc
            })
        }
        else
        {
            return res.send({
                success:'false'
            })
        }
    })
})


router.get('/productconsumptionforRep',(req,res)=>{

    orderdetail.aggregate([
        {
            $match : {
               
                $and: [
                    {orderdate:{ $gte:new Date(req.query.date1)}},
                    {orderdate:{ $lte:new Date(req.query.date2)}},
                    {salesrep:req.query.salesrep} 
                    ]
            }
        },
        {
            $group : {
               
                 _id:"$product",qty:{ $sum:"$qty"}
            }
        },
        {
            $sort : {
                qty : -1
            }
        }
    
    ],(err,doc)=>{
        
        if(err) console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                doc:doc
            })
        }
        else
        {
            return res.send({
                success:'false'
            })
        }
    })
    
})

router.get('/totalSalesforAdmin',(req,res)=>{

    order.aggregate([
        {
            $match :{
                $and: [
                    {orderdate:{ $gte:new Date(req.query.date1)}},
                    {orderdate:{ $lte:new Date(req.query.date2)}}
                ]
            }
        },
        {
            $group :{
                _id:"$salesrep",total:{$sum:"$ordertotal"},commission:{$sum:"$commission"}
            }
        },
        {
            $sort :{
                total : -1
            }
        }
    ],(err,doc)=>{

        if(err)console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                doc:doc
            })
        }
    });
})

router.get('/salesrepadmin',(req,res)=>{
    

    order.aggregate([
        {
            $match:{
                $and: [
                    {orderdate:{ $gte:new Date(req.query.date1)}},
                    {orderdate:{ $lte:new Date(req.query.date2)}},
                    {salesrep:req.query.salesrep}
                    ]
            }
        },
        {
            $group:{
                _id:"$customer",total:{$sum:"$ordertotal"}
            }
        },
        {
            $sort :{
                total : -1
            }
        }
    ],(err,doc)=>{
            if(err) console.log(err);

            if(doc.length>0)
            {
                orderdetail.aggregate([
                    {
                        $match : {
                           
                            $and: [
                                {orderdate:{ $gte:new Date(req.query.date1)}},
                                {orderdate:{ $lte:new Date(req.query.date2)}},
                                {salesrep:req.query.salesrep} 
                                ]
                        }
                    },
                    {
                        $group : {
                           
                             _id:"$product",qty:{ $sum:"$qty"}
                        }
                    },
                    {
                        $sort : {
                            qty : -1
                        }
                    }
                
                ],(err1,doc1)=>{
                    if(err1) console.log(err1);

                    if(doc1.length>0)
                    {
                        return res.status(200).send({
                            success:'true',
                            detailsalesrep:doc,
                            productconsumption:doc1
                        });
                    }
                })
            }
            else
            {
                return res.send({
                    success:'false'
                });
            }
    });
})

router.get('/salesrepcustomeradmin',(req,res)=>{
    
    order.aggregate([
        {
            $match:{
                $and: [
                    {orderdate:{ $gte:new Date(req.query.date1)}},
                    {orderdate:{ $lte:new Date(req.query.date2)}},
                    {customer:req.query.customer},
                    {salesrep:req.query.salesrep}
                    ]
            }
        },
        {
            $project:{
                _id:1,datestring:1,ordertotal:1,commission:1
            }
        }
    
    ],(err,doc)=>{
        if(err) console.log(err);

        if(doc.length>0)
        {
            orderdetail.aggregate([
                {
                    $match : {
                       
                        $and: [
                            {orderdate:{ $gte:new Date(req.query.date1)}},
                            {orderdate:{ $lte:new Date(req.query.date2)}},
                            {customer:req.query.customer},
                            {salesrep:req.query.salesrep} 
                            ]
                    }
                },
                {
                    $group : {
                       
                         _id:"$product",qty:{ $sum:"$qty"}
                    }
                },
                {
                    $sort : {
                        qty : -1
                    }
                }
            
            ],(err1,doc1)=>{
                if(err1) console.log(err1);

                if(doc1.length>0)
                {
                    return res.status(200).send({
                        success:'true',
                        customerorderdetails:doc,
                        productconsumption:doc1
                    });
                }
            })
        }
        else
        {
            return res.send({
                success:'false'
            });
        }
    });
})
    
router.get('/customerspecific',(req,res)=>{
    
    order.aggregate([
        {
            $match:{
                $and: [
                    {orderdate:{ $gte:new Date(req.query.date1)}},
                    {orderdate:{ $lte:new Date(req.query.date2)}},
                    {customer:req.query.customer}
                    ]
            }
        },
        {
            $project:{
                _id:1,datestring:1,ordertotal:1,salesrep:1,commission:1
            }
        },
        {
            $sort:{
                orderdate:-1
            }
        }
    
    ],(err,doc)=>{
        if(err) console.log(err);

        if(doc.length>0)
        {
            orderdetail.aggregate([
                {
                    $match : {
                       
                        $and: [
                            {orderdate:{ $gte:new Date(req.query.date1)}},
                            {orderdate:{ $lte:new Date(req.query.date2)}},
                            {customer:req.query.customer}
                            ]
                    }
                },
                {
                    $group : {
                       
                         _id:"$product",qty:{ $sum:"$qty"}
                    }
                },
                {
                    $sort : {
                        qty : -1
                    }
                }
            
            ],(err1,doc1)=>{
                if(err1) console.log(err1);

                order.aggregate([
                    {
                        $match:{
                            $and: [
                                {orderdate:{ $gte:new Date(req.query.date1)}},
                                {orderdate:{ $lte:new Date(req.query.date2)}},
                                {customer:req.query.customer}
                                ]
                        }
                    },
                    {
                        $group : {
                               _id:"$salesrep",total:{ $sum:"$ordertotal"},commission:{ $sum:"$commission"}
                        }
                    },
                    {
                        $sort : {
                            total:-1
                        }
                    }
                    
                ],(err2,doc2)=>{
                    if(err2) console.log(err2);

                    if(doc2.length>0)
                    {
                        return res.status(200).send({
                            success:'true',
                            customerspecificorderdetails:doc,
                            productconsumption:doc1,
                            totalbyrep:doc2
                        });
                    }
                });
               
            })
        }
        else
        {
            return res.send({
                success:'false'
            });
        }
    });
})


router.get('/allcustomerpurchase',(req,res)=>{
    
    order.aggregate([
        {
            $match:{
                $and: [
                    {orderdate:{ $gte:new Date(req.query.date1)}},
                    {orderdate:{ $lte:new Date(req.query.date2)}}
                    ]
            }
        },
        {
            $group:{
                _id:"$customer",total:{$sum:"$ordertotal"}
            }
        },
        {
            $sort :{
                total : -1
            }
        }
    ],(err,doc)=>{
            if(err) console.log(err);

            if(doc.length>0)
            {
                orderdetail.aggregate([
                    {
                        $match : {
                           
                            $and: [
                                {orderdate:{ $gte:new Date(req.query.date1)}},
                                {orderdate:{ $lte:new Date(req.query.date2)}} 
                                ]
                        }
                    },
                    {
                        $group : {
                           
                             _id:"$product",qty:{ $sum:"$qty"}
                        }
                    },
                    {
                        $sort : {
                            qty : -1
                        }
                    }
                
                ],(err1,doc1)=>{
                    if(err1) console.log(err1);

                    if(doc1.length>0)
                    {
                        return res.status(200).send({
                            success:'true',
                            customers:doc,
                            productconsumption:doc1
                        });
                    }
                })
            }
            else
            {
                return res.send({
                    success:'false'
                });
            }
    });
})

module.exports=router;
