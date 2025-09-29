// ================== import section ==================
import http from "http"; // express app কে http server এ কনভার্ট করতে হবে
import { WebSocketServer } from "ws"; // WebSocket server import করা হলো
import express from "express"; // express import
import cors from "cors"; // cors import
import dotenv from "dotenv"; // dotenv import

dotenv.config(); 

const app = express(); 
const port = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors()); 

// simple test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ================== express app -> http server ==================

const server = http.createServer(app); 
const wss = new WebSocketServer({ server }); 

// ================== WebSocket Connection ==================
wss.on("connection", (ws) => {
  console.log("✅ New client connected");

  // ক্লায়েন্টকে সাথে সাথে একবার মেসেজ পাঠানো হলো
  ws.send("👋 Welcome to the WebSocket server!");

  // ক্লায়েন্ট থেকে মেসেজ আসলে
  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());

    // broadcast = সকল connected client কে মেসেজ পাঠানো
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(`📢 Broadcast: ${message.toString()}`);
      }
    });
  });

  // ক্লায়েন্ট disconnect হলে
  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// ================== HTTP Server Start ==================
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`🌐 WebSocket running on ws://localhost:${port}`);
});

// ================== MongoDB Connection ==================
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hbah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("testDB");
    const usersCollection = db.collection("users");

    console.log("✅ MongoDB connected successfully");

    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
