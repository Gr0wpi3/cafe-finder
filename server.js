const express = require("express");
const cors = require("cors");
const path = require("path");

const api = require("./api");

const app = express();

app.use(cors());

// API routes
app.use(api);

// Frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Cafe Finder running on http://localhost:${PORT}`);
});