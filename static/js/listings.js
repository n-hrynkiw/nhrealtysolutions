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
    document.getElementById("listings-container").innerHTML = "<p>Loading...</p>";
    loadListings(market);
}

function displayListings(listings) {
    const container = document.getElementById("listings-container");
    container.innerHTML = ""; // Clear previous listings

    listings.forEach(house => {
        const listing = document.createElement("div");
        listing.classList.add("listing");

        listing.innerHTML = `
            <img src="${house.image_urls[0]}" alt="House Image">
            <div class="listing-info">
                <p><strong>Asking Price:</strong> $${house.price}</p>
                <p><strong>Beds:</strong> ${house.beds} | <strong>Baths:</strong> ${house.baths}</p>
                <p><strong>Square Feet:</strong> ${house.square_feet} sqft</p>
                <button onclick="viewHouse('${house.market}', '${house.house_id}')">View Details</button>
            </div>
        `;
        container.appendChild(listing);
    });
}

function viewHouse(market, houseId) {
    window.location.href = `/house.html?market=${market}&house_id=${houseId}`;
}
