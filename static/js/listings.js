document.addEventListener("DOMContentLoaded", () => {
    checkListings("texas"); // Start with Texas, but check for backup

    document.getElementById("texas-btn").addEventListener("click", () => changeMarket("texas"));
    document.getElementById("tennessee-btn").addEventListener("click", () => changeMarket("tennessee"));
});

async function checkListings(primaryMarket) {
    try {
        const response = await fetch(`/listings/${primaryMarket}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = await response.json();

        if (!data.listings || data.listings.length === 0) {
            console.log(`${primaryMarket} has no listings. Checking Tennessee...`);
            return checkListings("tennessee"); // Try Tennessee if Texas is empty
        }

        displayListings(data.listings);
    } catch (error) {
        console.error("Error loading listings:", error);
        document.getElementById("listings-container").innerHTML = "<p>Failed to load listings.</p>";
    }
}

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

        let imageUrl = house.image_urls && house.image_urls.length > 0 ? house.image_urls[0] : "static/images/placeholder.png";

        listing.innerHTML = `
        <div class="listing-container">
            <img src="${imageUrl}" alt="House Image" class="listing-image">
            <div class="listing-content">
                <p class="listing-address">${house.address}</p>
                <p><strong>Asking Price:</strong> $${house.price}</p>
                <p><strong>Beds:</strong> ${house.beds} | <strong>Baths:</strong> ${house.baths}</p>
                <p><strong>Square Feet:</strong> ${house.square_feet} sqft</p>
                <a href="/house.html?market=${house.market}&house_id=${house.house_id}" class="view-details">View Details</a>
            </div>
        </div>
        `;
        container.appendChild(listing);
    });
}

function viewHouse(market, houseId) {
    window.location.href = `/house.html?market=${market}&house_id=${houseId}`;
}
