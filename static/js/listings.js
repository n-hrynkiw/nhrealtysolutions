document.addEventListener("DOMContentLoaded", () => {
    loadListings("texas"); // Default to Texas

    document.getElementById("texas-btn").addEventListener("click", () => changeMarket("texas"));
    document.getElementById("tennessee-btn").addEventListener("click", () => changeMarket("tennessee"));
});

async function loadListings(market) {
    try {
        const response = await fetch(`/listings/${market}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();
        if (!data.listings || data.listings.length === 0) {
            document.getElementById("listings-container").innerHTML = "<p>No listings found.</p>";
            return;
        }

        displayListings(data.listings);
    } catch (error) {
        console.error("Error loading listings:", error);
        document.getElementById("listings-container").innerHTML = "<p>Error loading listings. Please try again.</p>";
    }
}

function changeMarket(market) {
    console.log(`Switching to ${market} market...`);

    const container = document.getElementById("listings-container");
    if (!container) {
        console.error("listings-container element not found!");
        return;
    }

    container.innerHTML = "<p>Loading...</p>";
    loadListings(market);
}

function displayListings(listings) {
    const container = document.getElementById("listings-container");
    container.innerHTML = ""; // Clear previous listings

    listings.forEach(house => {
        const listing = document.createElement("div");
        listing.classList.add("listing");

        listing.innerHTML = `
            <div class="listing-card">
                <img src="${house.image_urls[0]}" alt="House Image">
                <div class="listing-info">
                    <p><strong>Asking Price:</strong> $${house.price}</p>
                    <p><strong>Beds:</strong> ${house.beds} | <strong>Baths:</strong> ${house.baths}</p>
                    <p><strong>Square Feet:</strong> ${house.square_feet} sqft</p>
                    <button onclick="viewHouse('${house.market}', '${house.house_id}')">View Details</button>
                </div>
            </div>
        `;
        container.appendChild(listing);
    });
}

function viewHouse(market, houseId) {
    window.location.href = `/house.html?market=${market}&house_id=${houseId}`;
}
