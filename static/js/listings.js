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
    }
}

function changeMarket(market) {
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

        // Ensure there is at least one image in the array
        let imageUrl = house.image_urls && house.image_urls.length > 0 ? house.image_urls[0] : "static/images/placeholder.png";

        listing.innerHTML = `
        <img src="${imageUrl}" alt="House Image" class="listing-image">
        <div class="listing-content">
            <div class="listing-description">
                <p>${house.details.length > 150 ? house.details.substring(0, 150) + "..." : house.details}</p>
            </div>
            <div class="listing-main">
                <p class="listing-address">${house.address}</p>
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
