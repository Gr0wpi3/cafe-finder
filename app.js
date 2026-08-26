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
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            resultsContainer.innerHTML = `
                <div>
                    <h2>Location Found!</h2>
                    <p>Latitude: ${latitude}</p>
                    <p>Longitude: ${longitude}</p>
                </div>
            `;
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