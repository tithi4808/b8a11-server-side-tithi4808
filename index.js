
const express = require('express')
const cors=require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors({
  origin: ["https://booklet-a048e.web.app","http://localhost:5173/"],
  credentials:true
}));
app.use(express.json())

app.get('/', (req, res) => {
  res.send('booklet server side is running')
})




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.3vwvgpx.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db("Allblogs");
        const AllblogsCollection = database.collection("allblog");

        const database1 = client.db("Comments");
        const commentCollection = database1.collection("comment");

        const database2 = client.db("mywishlist");
        const wishlistCollection = database2.collection("mywishlist");
        

        app.get('/recentblogs', async(req, res) => {
            const cursor=AllblogsCollection.find().sort({ published_date: -1 })
            const result = await cursor.toArray()
            res.send(result) 
              
          });
          app.get('/allblogs', async(req, res) => {
            const cursor=AllblogsCollection.find()
            const result = await cursor.toArray()
            res.send(result) 
              
          });
          app.get('/featuredblogs', async(req, res) => {
            const cursor = await AllblogsCollection.find();
            const result = await cursor.toArray();

            result.sort((a, b) =>
              b.LongDescription.length - a.LongDescription.length
            );

            res.send(result);
              
          });

          app.post("/allblogs",async(req,res)=>{
            const newblogs=req.body
            const result = await AllblogsCollection.insertOne(newblogs);
            res.send(result)
          })
          

          app.get('/comment', async(req, res) => {
            console.log(req.query.blog_id)
            let query={}
            
            if(req.query?.blog_id)
            {
              query={blog_id:req.query.blog_id}
            }

            const cursor=commentCollection.find(query)
            const result = await cursor.toArray()
            res.send(result) 
              
          });
          app.get('/wishlist', async(req, res) => {

            
            console.log(req.query.email)
            let query={}

            if(req.query?.email)
            {
              query={email:req.query.email}
            }
           
            const cursor=wishlistCollection.find(query)
            const result = await cursor.toArray()
            res.send(result) 
              
          });
         

          app.put("/allblogs/:id",async(req,res)=>{
            const id=req.params.id
            const blogs=req.body
            const filter={_id:new ObjectId(id)}
            const option={upsert:true}
            const updatedblog={
              $set:{
                title:blogs.title,
                image:blogs.image,
                category:blogs.category,
                Shortdescription:blogs.Shortdescription,
                LongDescription:blogs.LongDescription,
  
              }
  
              
            }
            const result=await AllblogsCollection.updateOne(filter,updatedblog,option)
            res.send(result)
            
            
          })
         

          app.post("/comment",async(req,res)=>{
            const newcomment=req.body
            const result = await commentCollection.insertOne(newcomment);
            res.send(result)
          })
          app.post("/wishlist",async(req,res)=>{
            const newishlist=req.body
            const result = await wishlistCollection.insertOne(newishlist);
            res.send(result)
          })
          
          app.get("/allblogs/:id",async(req,res)=>{

            const id=req.params.id
            
             const query = {_id:new ObjectId(id)}
             const result = await AllblogsCollection.findOne(query);
             res.send(result)
  
  
          })
          app.delete("/wishlist/:_id",async(req,res)=>{
            const id=req.params._id
            
             const query = {_id:new ObjectId(id)}
             const result = await wishlistCollection.deleteOne(query);
             res.send(result)
  
            
          })


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})