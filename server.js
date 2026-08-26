const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 3000;

app.get("/api/test", (req, res) => {
    res.json({
        message: "Cafe Finder backend is working!"
    });
});

app.get("/api/cafes", (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({
            error: "Latitude and longitude are required."
        });
    }

    res.json({
        message: "Cafe search endpoint is working!",
        latitude: Number(lat),
        longitude: Number(lng)
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});