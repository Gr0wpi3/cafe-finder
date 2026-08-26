const findCafesButton = document.getElementById("find-cafes");
const resultsContainer = document.getElementById("results");

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

            try {
    const response = await fetch(
        `http://localhost:3000/api/cafes?lat=${latitude}&lng=${longitude}`
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

resultsContainer.innerHTML = `
    <div>
        <h2>${data.count} Cafes Found</h2>

        <div class="cafe-grid">
            ${data.cafes.map(cafe => `
                <div class="cafe-card">
                    <h3>${cafe.name}</h3>

                    ${cafe.street
                        ? `<p>📍 ${cafe.street}</p>`
                        : `<p>📍 Address unavailable</p>`
                    }

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