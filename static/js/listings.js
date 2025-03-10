document.addEventListener("DOMContentLoaded", function () {
    const listingsContainer = document.getElementById("listings-container");

    if (!listingsContainer) {
        console.error("Error: listings-container element not found.");
        return; // Stop the script from running on the index page
    }

    loadListings();
});


async function loadListings() {
    try {
        let response = await fetch(`/listings/texas`); // Fetch listings (change URL dynamically if needed)
        let data = await response.json();

        if (!data.listings || data.listings.length === 0) {
            document.getElementById("listings-container").innerHTML = "<p>No listings found.</p>";
            return;
        }

        displayListings(data.listings);
    } catch (error) {
        console.error("Error loading listings:", error);
        document.getElementById("listings-container").innerHTML = "<p>Error loading listings.</p>";
    }
}


// Redirect to house details page
function viewDetails(market, houseId) {
    window.location.href = `/house.html?market=${market}&house_id=${houseId}`;
}

// Change market when clicking a button
function changeMarket(market) {
    document.getElementById("listings-frame").src = `${market}.html`;
    setTimeout(() => loadListings(market), 500);
}
