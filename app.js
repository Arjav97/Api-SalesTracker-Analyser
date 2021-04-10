import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app=express();

var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true },function(error){
   if(error) console.log(error);
});

var auth=require('./routes/auth');
var product=require('./routes/product');
var productcatalogue=require('./routes/productcatalogue');
var salesrep=require('./routes/token');
var customer=require('./routes/customer');
var productenquiry=require('./routes/productenquiry');
var order=require('./routes/order');
var report=require('./routes/report');
var admindashboard=require('./routes/admindashboard');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api/sales',auth);
app.use('/api/product',product);
app.use('/api/productops',productcatalogue);
app.use('/api/token',salesrep);
app.use('/api/customer',customer);
app.use('/api/productenquiry',productenquiry);
app.use('/api/order',order);
app.use('/api/report',report);
app.use('/api/admindashboard',admindashboard);

const PORT=5000
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})
                            