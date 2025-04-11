const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const cors = require("cors");
const bcrypt = require('bcrypt');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "secret123"



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
  const userSc= new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
    
  })
  const User=mongoose.model("User",userSc)

  const hashPassword = async (password) => {
    try {
     
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('Hashed Password:', hashedPassword);
      return hashedPassword;  
    } catch (error) {
      console.error('Error hashing password:', error);
    }
  };
  


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
  
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);  

    if (isMatch) {
      console.log('Password matched!');
      
    
      const token = jwt.sign({ username: user.email }, SECRET_KEY, { expiresIn: '1h' });

     
      return res.json({
        message: "Login successful",
        token: token
      });

    } else {
      console.log('Incorrect password!');
      return res.status(400).json({ message: "Incorrect password" });
    }

  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const haspass=hashPassword(password)

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, haspass });
    await newUser.save();
    const token = jwt.sign({ username: email }, SECRET_KEY, { expiresIn: '1h' });
    
    res.status(201).json({ message: "User registered successfully", token:token});
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

app.get('/verify-token', (req, res) => {
  console.log("recevid")
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) return res.json({ success: false });

  const token = authHeader;
  console.log(token)
  try {
    console.log("decode started%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded)
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.json({ success: false });
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


app.use(cors());
app.use(express.json());


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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));
