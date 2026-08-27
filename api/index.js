const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api/test", (req, res) => {
    res.json({
        message: "Cafe Finder backend is working!"
    });
});

app.get("/api/cafes", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({
            error: "Latitude and longitude are required."
        });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({
            error: "Invalid latitude or longitude."
        });
    }

    const query = `
        [out:json];
        (
            node["amenity"="cafe"](around:3000,${latitude},${longitude});
            way["amenity"="cafe"](around:3000,${latitude},${longitude});
            relation["amenity"="cafe"](around:3000,${latitude},${longitude});
        );
        out center;
    `;

    try {
        const response = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "User-Agent": "CafeFinder/1.0 (personal learning project)"
                },
                body: new URLSearchParams({
                    data: query
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `Overpass API returned ${response.status}`
            );
        }

        const data = await response.json();

        const cafes = data.elements.map((place) => {
            const tags = place.tags || {};

            const cafeLatitude =
                place.lat ?? place.center?.lat;

            const cafeLongitude =
                place.lon ?? place.center?.lon;

            return {
                id: place.id,
                name: tags.name || "Unnamed Cafe",
                latitude: cafeLatitude,
                longitude: cafeLongitude,
                address: tags["addr:full"] || null,
                street: tags["addr:street"] || null,
                phone: tags.phone || null,
                website: tags.website || null,
                openingHours: tags.opening_hours || null
            };
        });

        res.json({
            success: true,
            count: cafes.length,
            cafes
        });

    } catch (error) {
        console.error("Cafe search error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to search for nearby cafes."
        });
    }
});

module.exports = app;