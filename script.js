document.addEventListener("DOMContentLoaded", function() {
    loadMarkets();
});

function loadMarkets() {
    fetch("/markets")
    .then(response => response.json())
    .then(data => {
        let marketTabs = document.getElementById("marketTabs");
        marketTabs.innerHTML = "";

        data.markets.forEach(market => {
            let tab = document.createElement("button");
            tab.className = "market-tab";
            tab.textContent = market;
            tab.onclick = () => navigateToMarket(market);
            marketTabs.appendChild(tab);
        });

        if (data.markets.length > 0) {
            loadListings(data.markets[0]); // Load first market automatically
        }
    })
    .catch(error => console.error("Error loading markets:", error));
}

function navigateToMarket(market) {
    // If we're currently on `house.html`, redirect to the market listings page
    if (window.location.pathname.includes("house.html")) {
        window.location.href = `${market}.html`;
    } else {
        loadListings(market); // Otherwise, just reload the listings
    }
}

function loadListings(market) {
    fetch(`/listings/${market}`)
    .then(response => response.json())
    .then(data => {
        console.log("Fetched data:", data); // Debugging log

        let listingsContainer = document.getElementById("listingsContainer");
        listingsContainer.innerHTML = "";

        // Check if 'listings' exists in the response and is an array
        if (!data || !data.listings || !Array.isArray(data.listings)) {
            console.error("Invalid data format received:", data);
            listingsContainer.innerHTML = "<p>Error loading listings.</p>";
            return;
        }

        if (data.listings.length === 0) {
            listingsContainer.innerHTML = "<p>No listings available.</p>";
            return;
        }

        data.listings.forEach(listing => {
            let listingDiv = document.createElement("div");
            listingDiv.className = "listing";

            let imageUrl = listing.image_urls && listing.image_urls.length > 0 
                ? listing.image_urls[0]  // Use first image if available
                : "placeholder.jpg";  // Use placeholder if no images

            listingDiv.innerHTML = `
                <img src="${imageUrl}" alt="House Image" style="width: 100px; height: 100px;">
                <h3>${listing.address || "No Address"}</h3>
                <p><strong>Asking Price:</strong> ${listing.price || "N/A"}</p>
                <p><strong>Beds:</strong> ${listing.beds || "N/A"} | <strong>Baths:</strong> ${listing.baths || "N/A"}</p>
                <p><strong>Square Feet:</strong> ${listing.square_feet || "N/A"}</p>
                <button onclick="viewHouse('${market}', '${listing.house_id}')">View Details</button>
            `;

            listingsContainer.appendChild(listingDiv);
        });
    })
    .catch(error => console.error("Error loading listings:", error));
}

function viewHouse(market, houseId) {
    window.location.href = `/house.html?market=${market}&house_id=${houseId}`;
}
