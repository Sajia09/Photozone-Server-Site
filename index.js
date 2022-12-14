const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.post('/jwt', (req, res) =>{
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.send({token})
})  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hmhhmh5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
   try{
    const serviceCollection = client.db('photozone').collection('services');
    const reviewCollection = client.db('photozone').collection('review');

    app.get('/services', async (req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    });
    app.get('/reviews', async (req, res) => {
        const query = {}
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
    });
    app.post('/services',  async (req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.send(result);
    });
    app.get('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = {serviceId: id};
        const reviews = await reviewCollection.find(query).toArray();
        res.send(reviews);
    });
    app.get('/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const review = await reviewCollection.findOne(query);
        res.send(review);
    });
    app.post('/reviews', async (req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    });
    app.get('/myreviews/:email', async (req, res) => {
        const email = req.params.email;
        const query = {email:email};
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    app.patch('/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const text = req.body.text;
        console.log(text);
        const updatedDoc = {
            $set:{
                "text":text
            }
        }
        const result = await reviewCollection.updateOne(query,updatedDoc);
        console.log(result);
        res.send(result);
    })
    app.delete('/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })

   }
   finally{

   }
   
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('photozone server is running');
})

app.listen(port, () => {
    console.log(`Photozone server running on ${port}`);
})