const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // 💥 This is mandatory for JSON body parsing

const PORT = process.env.PORT || 5000;

// Mongoose Schema and Model

const placeSchema = new mongoose.Schema({
    name: String,
    description: String,
    latitude: Number,
    longitude: Number,
    reviews: [
      {
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  app.post("/review", async (req, res) => {
    const {latitude,longitude,message } = req.body;
    console.log(latitude, longitude, message);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    try {
      const place = await Place.findOne({ latitude, longitude });
  
      if (!place) return res.status(404).json({ error: "Place not found" });
  
      place.reviews.push({ message });
      console.log(place.reviews)
      const updated = await place.save();
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error saving review" });
    }
  });  
const Place = mongoose.model("Place", placeSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/place", async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    const newPlace = new Place({ name, description, latitude, longitude });
    const saved = await newPlace.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save place" });
  }
});

app.get("/places", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// DB Connect + Server Start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
