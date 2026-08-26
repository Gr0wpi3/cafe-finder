const findCafesButton = document.getElementById("find-cafes");
const resultsContainer = document.getElementById("results");

findCafesButton.addEventListener("click", function () {
    resultsContainer.innerHTML = `
        <div>
            <h2>Searching for cafes...</h2>
            <p>Please wait.</p>
        </div>
    `;
});