document.addEventListener("DOMContentLoaded", () => {
    const market = getMarketFromPath(); // auto-detect
    loadListings(market);
});

function getMarketFromPath() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("memphis")) return "memphis";
    if (path.includes("nashville")) return "nashville";
    if (path.includes("sanantonio")) return "sanantonio";
    if (path.includes("houston")) return "houston";
    if (path.includes("dallas")) return "dallas";
    return "texas"; // fallback
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

function displayListings(listings) {
    const container = document.getElementById("listings-container");
    container.innerHTML = "";
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
        </div>`;
        container.appendChild(listing);
    });
}
