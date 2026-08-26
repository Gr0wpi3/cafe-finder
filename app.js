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

    resultsContainer.innerHTML = `
        <div>
            <h2>Backend Connected!</h2>
            <p>${data.message}</p>
            <p>Latitude: ${data.latitude}</p>
            <p>Longitude: ${data.longitude}</p>
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