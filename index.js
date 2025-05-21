const express = require("express");
const mongoose = require("mongoose");

// Initialize express app
const app = express();
app.use(express.json());

// MongoDB connection URI 
const mongoURI = 'mongodb://127.0.0.1:27017/mynewdb';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB Compass'))
.catch(err => console.error(' MongoDB connection error:', err));

// Define schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    id: Number
});

const User = mongoose.model("User", userSchema);

// POST route to insert data
app.post("/post", async (req, res) => {
    try {
        const data = new User({
            name: req.body.name,
            email: req.body.email,
            id: req.body.id
        });

        const savedData = await data.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(500).json({ error: "Failed to save data" });
    }
});



app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.find({id: req.params.id});
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// GET route to fetch all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// PUT - Update by id
app.put("/update/:id", async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to update"});
    }
});

// DELETE - Delete by id
app.delete("/delete/:id", async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted", user: deletedUser });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});


// Start the server
app.listen(3000, () => {
    console.log(" Server running on http://localhost:3000");
});
