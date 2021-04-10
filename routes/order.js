var express=require("express");
var router=express.Router();
var product=require('../models/product');
var orderdetail=require('../models/orderdetail');
var order=require('../models/order');
var customer=require('../models/customer');

router.get('/checkquantity',(req,res)=>{

    product.findOne({"name":req.query.pro},(err,doc)=>{
        if(err)console.log(err);

        if(doc)
        {
            if(+req.query.qty <= +doc.qty)
            {
                return res.status(200).send({
                    success:'true',
                    message:'Quantity Available',
                    price:doc.price

                });
            }
            else
            {   
                return res.send({
                    success:'false',
                    message:'Quantity Unavailable'
                });
            }
        }
    })
})

router.post('/Submit',(req,res)=>{

    var orders=req.body;
    
    if(req.get('customer')==='')
    {
        return res.send({
            success:'false',
            message:'Customer Id is missing'
        });
    }

    customer.findOne({ $and: [ {"email":req.get('customer')} , {"salesrep":req.get('salesrep')} ]},(err1,doc1)=>{
        if(err1)console.log(err1);

        if(doc1)
  {

    if(orders.length==0)
    {
        return res.send({
            success:'false',
            message:'No order selected'
        });
    }
    let commission=0;
    let flag='false';
    for(let i = 0; i < orders.length; i++)
    {
        
        product.findOne({"name":orders[i].product},(err,doc)=>{
            if(err)console.log(err);
            
             if(doc)
            {    
               flag='true';

                commission= commission + ((+(orders[i].qty)) * (+(doc.comm))) ;
                
                var qty= ((+(doc.qty))-(+(orders[i].qty))).toString();
                
                product.findOneAndUpdate({"name":orders[i].product},{"qty":qty},(err,doc)=>{
                    });

                new orderdetail({
                    
                    _id     : orders[i].id,
                    orderId :  req.get('id'),             
                    product : orders[i].product,
                    qty     : +(orders[i].qty) ,
                    subtotal: +(orders[i].total),
                    orderdate:new Date(),
                    datestring:req.get('datestring'),
                    salesrep:req.get('salesrep'),
                    customer:req.get('customer')
                    
                    }).save((err,doc)=>{
                });
            }
        });
    }
     
    setTimeout(()=>{
        if(flag==='false')
        {
            return res.send({success:'false',
            message:'No order selected'});
        }
        else{
            
            new order({
                _id    : req.get('id'),
                salesrep: req.get('salesrep'),
                customer: req.get('customer'),
                orderdate:new Date(),
                datestring: req.get('datestring'),
                commission: commission,
                ordertotal: +(req.get('total'))
                }).save((err,doc)=>{
                    return res.send({success:'true'});
            })
        }
    },100);

  }
  else
  {
    return res.send({
        success:'false',
        message:'Not registered customer'
    });
  }
});
});

module.exports=router; 