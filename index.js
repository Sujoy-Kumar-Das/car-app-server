const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
port = process.env.PORT || 5000;

// middle ware
app.use(cors())
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.Db_user}:${process.env.Db_password}@cluster0.j1u8ft3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect(){
    try {
        await client.connect();
        console.log("Database connected");
    } catch (error) {
        console.error(error.name,error.message)
    }
}

dbConnect()


// db collections
const serviceColections = client.db('car-db').collection('services')
const ordersColections =  client.db('car-db').collection('orders')

// get service data
app.get('/services',async(req,res)=>{
    try {
        const query = {}
        const curssor = serviceColections.find(query)
        const services = await curssor.toArray();
        res.send({
            success:true,
            data:services
        })
    } catch (error) {
        res.send({
            success:false,
            data:[],
            
        })
        console.log( error.name,error.message)
    }
});

// get service data by id 
app.get('/services/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const service = await serviceColections.findOne(query)
        res.send(
            {
                success:true,
                data:service
            }
        )
    } catch (error) {
        res.send({
            success:false,
            data:[],
            
            
        })
        console.log( error.name,error.message)
    }
})

// post orders
app.post('/orders',async(req,res)=>{
    try {
        const order = req.body;
        const result = await ordersColections.insertOne(order)
        res.send({
            success:true,
            data:result
        })

    } catch (error) {
        res.send({
            success:false,
            data:[],
            
            
        })
        console.log( error.name,error.message)
    }
    
})

// get all orders
app.get('/orders',async(req,res)=>{
    try {
        let query = {};
        if(req.query.email){
            query =  {
                email: req.query.email
            }
        };
        const curssor = ordersColections.find(query)
        const orders = await curssor.toArray();
        res.send(orders)
    } catch (error) {
        res.send({
            success:false,
            data:[],
            message:error
        })
        console.log( error.name,error.message)
    }
})






app.listen(port,()=>{
    console.log('server is running')
})
