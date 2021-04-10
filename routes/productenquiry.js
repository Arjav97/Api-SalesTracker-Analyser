var express=require("express");
var router=express.Router();
var productenquiry=require('../models/productenquiry');


router.post('/AddEnquiry',(req,res)=>{
    
    if(!req.body.desc){
        return res.send({
               success:'false',
               message:'Description is required'
           });
    }
  
    new productenquiry({
        _id:req.body._id,
        desc:req.body.desc,
        status:req.body.status,
        salesrep:req.body.salesrep,
        date:req.body.date,
        datestring:req.body.datestring
            }).save((err,doc)=>{
                if(err) console.log(err);
                else
                {
                    res.status(200).send({
                        success:'true',
                        message:'Enquiry Sent Successfully',
                        enquiry:doc
                    });
                }
            });
})

router.get('/getEnquiries',(req,res)=>{

    productenquiry.find({"status":"waiting"},(err,doc)=>{
        
        if(err) console.log(err);
        
        if(doc.length>0)
        {
            return  res.status(200).send({
                success:'true',
                message:'Enquiries Available',
                enquiries:doc,
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'Enquiries not available'
        });
        }
    }).sort({"date":-1});
});

router.get('/getAcceptedEnquiriesForRep',(req,res)=>{

    productenquiry.find({$and:[{"salesrep":req.query.salesrep},{"status":"accepted"}]},(err,doc)=>{
        if(err) console.log(err);
        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                message:'Accepted Enquiries Available',
                acceptedenquiries:doc
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'No accepted enquiries available'
            })
        }
    }).sort({"date":-1});
});


router.get('/getWaitingEnquiriesForRep',(req,res)=>{

    productenquiry.find({$and:[{"salesrep":req.query.salesrep},{"status":"waiting"}]},(err,doc)=>{
        if(err) console.log(err);
        
        if(doc.length>0)
        {
          return res.status(200).send({
            success:'true',
            message:'Waiting Enquiries Available',
            waitingenquiries:doc
            });  
        }
        else
        {
            return res.send({
                success:'false',
                message:'No waiting enquiries available'
            })
        }
    }).sort({"date":-1});
});


router.get('/getRejectedEnquiriesForRep',(req,res)=>{

    productenquiry.find({$and:[{"salesrep":req.query.salesrep},{"status":"rejected"}]},(err,doc)=>{
        if(err) console.log(err);
        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                message:'Rejected Enquiries Available',
                rejectedenquiries:doc
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'No rejected enquiries available'
            })
        }
    }).sort({"date":-1});
});

    router.get('/getAcceptedEnquiries',(req,res)=>{

        productenquiry.find({"status":"accepted"},(err,doc)=>{
            
            if(err) console.log(err);
            
            if(doc.length>0)
            {   
                return  res.status(200).send({
                    success:'true',
                    message:'Accepted Enquiries Available',
                    enquiries:doc,
                    });
            }
            else
            {
                return res.send({
                    success:'false',
                    message:'No Enquiries Accepted'
            });
            }
        }).sort({"date":-1});
    
    });

router.get('/rejectEnquiry',(req,res)=>{

    productenquiry.findOneAndUpdate({"_id":req.query._id},{"status":"rejected"},(err,doc)=>{
        
        if(err) console.log(err);
        
        if(doc)
        {
            return  res.status(200).send({
                success:'true',
                message:'Enquiry Successfully Rejected',
                enquiry:doc,
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'Enquiry Not Successfully Rejected'
        });
        }
    });
});


router.get('/acceptEnquiry',(req,res)=>{

    productenquiry.findOneAndUpdate({"_id":req.query._id},{"status":"accepted"},(err,doc)=>{
        
        if(err) console.log(err);
        
        if(doc)
        {
            return  res.status(200).send({
                success:'true',
                message:'Enquiry Successfully Accepted',
                enquiry:doc,
                });
        }
        else
        {
            return res.send({
                success:'false',
                message:'Enquiry Not Successfully Accepted'
        });
        }
    });
});

router.get('/searchAcceptedEnquiryByRep',(req,res)=>{

    productenquiry.find({$and:[{"salesrep":req.query.id},{"status":"accepted"}]},(err,doc)=>{
        if(err) console.log(err);

        if(doc.length>0)
        {
            return res.status(200).send({
                success:'true',
                message:'Accepted Enquiries Available',
                enquiries:doc
            })
        }
        else
        {
            return res.send({
                success:'false',
                message:'Accepted Enquiries Not Available'
            })
        }
    }).sort({"date":-1});
})

module.exports=router; 