const findCafesButton = document.getElementById("find-cafes");
const resultsContainer = document.getElementById("results");

const map = L.map("map").setView([8.4795, 124.6623], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let cafeMarkers = [];
let userMarker = null;

findCafesButton.addEventListener("click", function () {
    if (!navigator.geolocation) {
        resultsContainer.innerHTML = `
            <div>
                <h2>Location Not Supported</h2>
                <p>Your browser does not support location services.</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = `
        <div>
            <h2>Getting your location...</h2>
            <p>Please allow location access when prompted.</p>
        </div>
    `;

    navigator.geolocation.getCurrentPosition(
        async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // Move map to user's actual location
map.setView([latitude, longitude], 15);

// Remove previous user marker
if (userMarker) {
    map.removeLayer(userMarker);
}

// Add user's current location marker
userMarker = L.circleMarker([latitude, longitude], {
    radius: 10,
    fillColor: "#4285F4",
    color: "#ffffff",
    weight: 3,
    fillOpacity: 1
}).addTo(map);

userMarker.bindPopup("<b>You are here</b>").openPopup();
            // Move map to user's actual location
map.setView([latitude, longitude], 15);

// Remove previous user marker
if (userMarker) {
    map.removeLayer(userMarker);
}

// Add user location marker
userMarker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("<strong>📍 You are here</strong>");

            try {
                const response = await fetch(
                    `/api/cafes?lat=${latitude}&lng=${longitude}`
                );

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || "Cafe search failed.");
                }

                if (data.cafes.length === 0) {
                    resultsContainer.innerHTML = `
                        <div>
                            <h2>No Cafes Found</h2>
                            <p>We couldn't find any cafes nearby.</p>
                        </div>
                    `;
                    return;
                }

                // Remove old cafe markers
cafeMarkers.forEach(marker => map.removeLayer(marker));
cafeMarkers = [];

// Add new cafe markers
data.cafes.forEach(cafe => {
    const marker = L.marker([
        Number(cafe.latitude),
        Number(cafe.longitude)
    ]).addTo(map);

    marker.bindPopup(`
    <div class="map-popup">
        <strong>${cafe.name}</strong><br>
        📍 ${cafe.street || "Address unavailable"}<br>
        📏 ${Number(cafe.distanceKm).toFixed(2)} km away
    </div>
`);

    cafeMarkers.push(marker);
});

                // Calculate distance between two coordinates
                function calculateDistance(lat1, lon1, lat2, lon2) {
                    const R = 6371;

                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;

                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1 * Math.PI / 180) *
                        Math.cos(lat2 * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

                    const c = 2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                    );

                    return R * c;
                }

                // Add distance to each cafe
                const cafesWithDistance = data.cafes.map(cafe => ({
                    ...cafe,
                    distance: calculateDistance(
                        latitude,
                        longitude,
                        Number(cafe.latitude),
                        Number(cafe.longitude)
                    )
                }));

                // Sort nearest cafes first
                cafesWithDistance.sort(
                    (a, b) => a.distance - b.distance
                );

                // Display cafes
                resultsContainer.innerHTML = `
                    <div>
                        <h2>${cafesWithDistance.length} Cafes Found</h2>

                        <div class="cafe-grid">
                            ${cafesWithDistance.map(cafe => `
                                <div class="cafe-card">
                                    <h3>${cafe.name}</h3>

                                    ${cafe.street
                                        ? `<p>📍 ${cafe.street}</p>`
                                        : `<p>📍 Address unavailable</p>`
                                    }

                                    <p>
                                        📏 ${cafe.distance.toFixed(2)} km away
                                    </p>

                                    ${cafe.openingHours
                                        ? `<p>🕒 ${cafe.openingHours}</p>`
                                        : ""
                                    }

                                    ${cafe.phone
                                        ? `<p>📞 ${cafe.phone}</p>`
                                        : ""
                                    }

                                    ${cafe.website
                                        ? `<p>
                                            <a href="${cafe.website}" target="_blank">
                                                Website
                                            </a>
                                           </p>`
                                        : ""
                                    }

                                    <p class="coordinates">
                                        ${Number(cafe.latitude).toFixed(5)},
                                        ${Number(cafe.longitude).toFixed(5)}
                                    </p>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;

            } catch (error) {
                resultsContainer.innerHTML = `
                    <div>
                        <h2>Backend Connection Failed</h2>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        },

        function (error) {
            resultsContainer.innerHTML = `
                <div>
                    <h2>Unable to Get Location</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    );
});