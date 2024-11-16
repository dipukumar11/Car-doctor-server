const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId, CURSOR_FLAGS } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

//middlewere setup 




app.use(cors())
app.use(express.json())

//mong start in hear



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p2lut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const Servicedatabase = client.db("car-doctor").collection("ServicsColaction");
    const bookingCollaction = client.db("car-doctor").collection('servicBoking')
   

app.get('/services', async(req, res)=>{
  const cursor = Servicedatabase.find()
  const ruselt = await cursor.toArray()
  res.send(ruselt)
})

app.get('/services/:id', async(req, res)=>{
  const id = req.params.id;
  const quary = {_id: new ObjectId(id)}
//option file

const options = {

  // Include only the `title` and `imdb` fields in the returned document
  projection: { title: 1, price: 1, description:1, img:1, service_id:1 },
};


  const result = await Servicedatabase.findOne(quary, options)
  res.send(result)
})


//booking service stert

app.post('/bookings', async (req, res)=>{
   const booking = req.body;
   console.log(booking)
   const result = await bookingCollaction.insertOne(booking)
   res.send(result)
   
})

app.get('/bookings', async(req, res)=>{
  console.log(req.query)
  let query ={}
  if(req.query?.email){
    query = {email: req.query.email}
  }
   const result = await bookingCollaction.find().toArray()
   res.send(result)

})

app.delete('/bookings/:id', async(req, res)=>{
     const id = req.params.id
     const quary ={_id: new ObjectId(id)}
     const result = await bookingCollaction.deleteOne(quary)
     res.send(result)
})

//update section

app.patch('/bookings/:id', async(req, res)=>{
     
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}

  const booking = req.body;
  const updateDoc = {
    $set: {
      status: booking.status
    },
  };

  const result = await bookingCollaction.updateOne(filter, updateDoc)
  res.send(result)
   
   console.log(booking)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res)=>{
    res.send("Hello Bangladesh")
})


app.listen(port, ()=>{
    console.log(`Port Runing By ${port}`)
})