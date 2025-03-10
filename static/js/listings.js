async function loadListings(market) {
    try {
        let response = await fetch(`/listings/${market}`);
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

// ✅ Function to Display Listings
function displayListings(listings) {
    let container = document.getElementById("listings-container");
    container.innerHTML = ""; // Clear previous listings

    listings.forEach(house => {
        let listingDiv = document.createElement("div");
        listingDiv.classList.add("listing");

        listingDiv.innerHTML = `
            <img src="${house.image_urls[0] || 'default-image.jpg'}" alt="House Image">
            <div class="listing-info">
                <p><strong>Asking Price:</strong> ${house.price}</p>
                <p><strong>Beds:</strong> ${house.beds}</p>
                <p><strong>Baths:</strong> ${house.baths}</p>
                <p><strong>Square Feet:</strong> ${house.square_feet}</p>
                <button onclick="viewDetails('${house.market}', '${house.house_id}')">View Details</button>
            </div>
        `;
        container.appendChild(listingDiv);
    });
}

// ✅ Function to Load Market Listings
function changeMarket(market) {
    document.getElementById("listings-container").innerHTML = "<p>Loading...</p>";
    loadListings(market);
}

// ✅ Redirect to House Details Page
function viewDetails(market, houseId) {
    window.location.href = `/house.html?market=${market}&house_id=${houseId}`;
}

// ✅ Auto-load Listings on Page Load
document.addEventListener("DOMContentLoaded", function() {
    let currentMarket = window.location.pathname.includes("tennessee") ? "tennessee" : "texas";
    loadListings(currentMarket);
});
