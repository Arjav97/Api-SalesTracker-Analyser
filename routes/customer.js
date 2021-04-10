var express=require("express");
var router=express.Router();
var customer=require('../models/customer');
var followup=require('../models/followup');
var order=require('../models/order');
var orderdetail=require('../models/orderdetail');

router.get('/AddCustomer',(req,res)=>{
    
    if(!req.query.name){
        return res.send({
               success:'false',
               message:'Name is Required'
           });
       }
   
    else if(!req.query.email){
        return res.send({
            success:'false',
            message:'Email is required'
        });
    }

customer.findOne({"email":req.query.email , "salesrep":req.query.salesrep },(err2,doc2)=>{
    if(err2) console.log(err2);

    if(doc2)
    {
        return res.send({
            success:'false',
            message:'Customer Already Registered',
        });
    }
    else
    {
        new customer({
            email:req.query.email,
            name:req.query.name,
            salesrep:req.query.salesrep
                }).save((err,doc)=>{
                    if(err) console.log(err);
                    else if(req.query.desc!=='')
                        {
                                new followup({
                                    email:req.query.email,
                                    salesrep:req.query.salesrep,
                                    desc:req.query.desc,
                                    date:req.query.date,
                                    datestring:req.query.datestring,
                                    status:"Pending"
                                }).save((err1,doc1)=>{
                                    if(err1)console.log(err1);
                                    else
                                {
                                    return  res.status(200).send({
                                            success:'true',
                                            message:'Customer Added Successfully With FollowUp',
                                            customer:doc,
                                            followup:doc1
                                    });
                                }
                            });
                        }
                    else
                        {
                            return res.status(200).send({
                                success:'true',
                                message:'Customer Added Successfully',
                                customer:doc
                            });
                        }
    });
    }
});
})

router.get('/addnewFollowUp',(req,res)=>{
    
    if(!req.query.email)
    {
        return res.send({
            success:'false',
            message:'Email is required'
        });
    }

    if(!req.query.desc)
    {
        return res.send({
            success:'false',
            message:'Description is required'
        });
    }

    customer.findOne({ $and: [ {"email":req.query.email} , {"salesrep":req.query.salesrep} ]},(err,doc)=>{
        if(err)console.log(err);

        if(doc)
        {
            new followup({
                email:req.query.email,
                salesrep:req.query.salesrep,
                desc:req.query.desc,
                date:new Date(),
                datestring:req.query.datestring,
                status:"Pending"
            }).save((err1,doc1)=>{
                if(err1)console.log(err1);
                else
              {
                return  res.status(200).send({
                        success:'true',
                        message:'FollowUp Added Successfully',
                        followup:doc1  
                });
              }
           });
        }
        else
        {
            return res.send({
                success:'false',
                message:'Not registered customer'
            });
        }
    });
})



router.get('/showallFollowUps',(req,res)=>{

    if(!req.query.email)
    {
        return res.send({
            success:'false',
            message:'Customer Id is missing'
        });
    }

    customer.findOne({ $and: [ {"email":req.query.email} , {"salesrep":req.query.salesrep} ]},(err1,doc1)=>{
    if(err1)console.log(err1);

    if(doc1)
    {

    followup.find({ $and: [ {"email":req.query.email} , {"salesrep":req.query.salesrep} ]},(err,doc)=>{
        if(err) console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                message:'FollowUps found',
                followups:doc
            });
        }
        else
        {
            return res.send({
                success:'false',
                message:'No followups found'
            })
        }
       
      }).sort({"date":-1})
    }
    else
    {
        return res.send({
            success:'false',
            message:'Not registered customer'
        });
    }
})
})

router.get('/searchCustomerFollowUp',(req,res)=>{

    if(!req.query.email)
    {
        return res.send({
            success:'false',
            message:'Customer Id is missing'
        });
    }
    
    customer.findOne({ $and: [ {"email":req.query.email} , {"salesrep":req.query.salesrep} ]},(err1,doc1)=>{
        if(err1)console.log(err1);

        if(doc1)
        {
            followup.find({ $and: [{"email":req.query.email},{"salesrep":req.query.salesrep},{"status":"Pending"}] },(err,doc)=>{

                if(err) console.log(err);
        
                if(doc.length>0)
                {
                    return res.status(200).send({
                        success:'true',
                        message:'Found Pending FollowUp',
                        followup:doc
                    });
                }
                else
                {
                    return res.send({
                        success:'false',
                        message:'No Pending FollowUps'
                    });
                }
            })
        }
        else
        {
            return res.send({
                success:'false',
                message:'Not registered customer'
            });
        }
    });
})

router.get('/removeFollowUp',(req,res)=>{
        followup.updateOne({"_id":req.query.id},{"status":"Done"},(err,doc)=>{
        if(err) console.log(err);
    
        if(doc)
        {   
            return res.status(200).send({
                success:'true',
                message:'FollowUp Completed successfully'
            });
        }
    })
})

router.get('/searchcustomerHistory',(req,res)=>{
    order.find({ $and: [{"customer":req.query.customer},{"salesrep":req.query.salesrep}]},(err,doc)=>{
        var odetail=[];
        if(err)console.log(err);
     
        
        doc.forEach(d => {
            orderdetail.find({"orderId":d._id},(err1,doc1)=>{
                if(err1) console.log(err1);

                if(doc1.length>0)
                {
                    doc1.forEach(d1=>{
                        odetail.push(d1);
                    });
                    
                }
        });
    });
       
        setTimeout(()=>{
           
            if(doc.length>0)
            {
                return res.send({
                    order:doc,
                    orderdetail:odetail,
                    success:'true'
                })
            }
            else
            {
                return res.send({
                    success:'false'
                })
            }
        },2000);
       
    }).sort({"orderdate":-1});
})

router.get('/viewallcustomerordersforRep',(req,res)=>{
    
    order.find({ "salesrep":req.query.salesrep },(err,doc)=>{
        var odetail=[];
        if(err)console.log(err);
     
        
        doc.forEach(d => {
            orderdetail.find({"orderId":d._id},(err1,doc1)=>{
                if(err1) console.log(err1);

                if(doc1.length>0)
                {
                    doc1.forEach(d1=>{
                        odetail.push(d1);
                    });
                    
                }
        });
    });
       
        setTimeout(()=>{
           
            if(doc.length>0)
            {
                return res.send({
                    order:doc,
                    orderdetail:odetail,
                    success:'true'
                })
            }
            else
            {
                return res.send({
                    success:'false'
                })
            }
        },2000);
       
    }).sort({"orderdate":-1});
})

router.get('/viewallcustomerordersforAdmin',(req,res)=>{
    
    order.find({},(err,doc)=>{
        var odetail=[];
        if(err)console.log(err);
     
        
        doc.forEach(d => {
            orderdetail.find({"orderId":d._id},(err1,doc1)=>{
                if(err1) console.log(err1);

                if(doc1.length>0)
                {
                    doc1.forEach(d1=>{
                        odetail.push(d1);
                    });
                    
                }
        });
    });
       
        setTimeout(()=>{
           
            if(doc.length>0)
            {
                return res.send({
                    order:doc,
                    orderdetail:odetail,
                    success:'true'
                })
            }
            else
            {
                return res.send({
                    success:'false'
                })
            }
        },2000);
       
    }).sort({"orderdate":-1});
})

router.get('/viewallcustomerordersforAdminbyRep',(req,res)=>{
    
    order.find({"salesrep":req.query.salesrep},(err,doc)=>{
        var odetail=[];
        if(err)console.log(err);
     
        doc.forEach(d => {
            orderdetail.find({"orderId":d._id},(err1,doc1)=>{
                if(err1) console.log(err1);

                if(doc1.length>0)
                {
                    doc1.forEach(d1=>{
                        odetail.push(d1);
                    });
                    
                }
        });
    });
       
        setTimeout(()=>{
           
            if(doc.length>0)
            {
                return res.send({
                    order:doc,
                    orderdetail:odetail,
                    success:'true'
                })
            }
            else
            {
                return res.send({
                    success:'false',
                    message:'No orders found'
                })
            }
        },2000);
       
    }).sort({"orderdate":-1});
})

router.get('/filterordersbydatesbyrep',(req,res)=>{
   
    order.find({$and:[ {"salesrep":req.query.salesrep} , {"orderdate":{ "$gte":new Date(req.query.date1),"$lte":new Date(req.query.date2) }}]},(err,doc)=>{
        if(err) console.log(err);
        var odetail=[];
            
        doc.forEach(d => {
            orderdetail.find({"orderId":d._id},(err1,doc1)=>{
                if(err1) console.log(err1);

                if(doc1.length>0)
                {
                    doc1.forEach(d1=>{
                        odetail.push(d1);
                    });
                    
                }
        });
    });
       
        setTimeout(()=>{
           
            if(doc.length>0)
            {
                return res.send({
                    order:doc,
                    orderdetail:odetail,
                    success:'true'
                })
            }
            else
            {
                return res.send({
                    success:'false',
                    });
            }
        },2000);
       
    });

})

router.get('/filterordersbydates',(req,res)=>{
    
    order.find({"orderdate":{ "$gte":new Date(req.query.date1),"$lte":new Date(req.query.date2) }},(err,doc)=>{
        if(err) console.log(err);
        var odetail=[];
            
        doc.forEach(d => {
            orderdetail.find({"orderId":d._id},(err1,doc1)=>{
                if(err1) console.log(err1);

                if(doc1.length>0)
                {
                    doc1.forEach(d1=>{
                        odetail.push(d1);
                    });
                    
                }
        });
    });
       
        setTimeout(()=>{
           
            if(doc.length>0)
            {
                return res.send({
                    order:doc,
                    orderdetail:odetail,
                    success:'true'
                })
            }
            else
            {
                return res.send({
                    success:'false',
                    });
            }
        },2000);
       
    });

})

module.exports=router;