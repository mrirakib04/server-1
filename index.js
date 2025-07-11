import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(
  cors({
    origin: ["https://mrirakib-web-practice-7.netlify.app"],
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_ACCESS}@cluster0.bfqzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    // Connections
    const database = client.db("chill_gamer");
    const reviewCollection = database.collection("reviews");
    const watchlistCollection = database.collection("watchlist");

    // Reading
    // reviews reading
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // rating based reading
    app.get("/rating", async (req, res) => {
      const cursor = reviewCollection.find().sort({ rating: -1 }); // descending order for ratings
      const result = await cursor.toArray();
      res.send(result);
    });
    // year based reading
    app.get("/year", async (req, res) => {
      const cursor = reviewCollection.find().sort({ publishYear: -1 }); // latest year first
      const result = await cursor.toArray();
      res.send(result);
    });
    // top-rated reading
    app.get("/reviews/top-rated", async (req, res) => {
      const cursor = reviewCollection
        .find() // Fetch all reviews
        .sort({ rating: -1 }) // Sort by rating in descending order
        .limit(6); // Limit the result to top 6 reviews
      const result = await cursor.toArray();
      res.send(result);
    });
    // single review reading
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });
    // review for update reading
    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });
    // user reviews reading
    app.get("/reviews/:userEmail", async (req, res) => {
      const userEmail = req.params.userEmail;
      const query = {
        userEmail: userEmail,
      };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });
    // watchlist reading
    app.get("/watchlist", async (req, res) => {
      const cursor = watchlistCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // user watchlist reading
    app.get("/watchlist/:currentUserEmail", async (req, res) => {
      const currentUserEmail = req.params.currentUserEmail;
      const query = {
        currentUserEmail: currentUserEmail,
      };
      const result = await watchlistCollection.find(query).toArray();
      res.send(result);
    });

    // Posting
    // review posting
    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });
    // watchlist posting
    app.post("/watchlist", async (req, res) => {
      const newWatchlistReview = req.body;
      const result = await watchlistCollection.insertOne(newWatchlistReview);
      res.send(result);
    });

    // Updating
    // review updating
    app.put("/updated/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedReview = {
        $set: req.body,
      };
      const result = await reviewCollection.updateOne(
        filter,
        updatedReview,
        options
      );
      res.send(result);
    });

    // Delete
    // watchlist deleting
    app.delete("/watchlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchlistCollection.deleteOne(query);
      res.send(result);
    });
    // review deleting
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My HOT Server Is Ready.");
});
app.listen(port, () => {
  console.log(`Server in port: ${port}`);
});
