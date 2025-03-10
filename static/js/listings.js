document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => loadListings("texas"), 200); // Load Texas listings on page load
});

function loadListings(market) {
    fetch(`/listings/${market}`)
        .then(response => response.json())
        .then(data => {
            const listingsContainer = document.getElementById("listings-container");

            if (!listingsContainer) {
                console.error("Error: listings-container element not found.");
                return;
            }

            listingsContainer.innerHTML = ""; // Clear previous listings

            if (data.listings.length === 0) {
                listingsContainer.innerHTML = "<p>No listings available.</p>";
                return;
            }

            data.listings.forEach(house => {
                const listing = document.createElement("div");
                listing.classList.add("listing");

                listing.innerHTML = `
                    <img src="${house.image_urls[0] || 'static/images/placeholder.jpg'}" alt="House Image">
                    <div class="listing-info">
                        <h3>${house.address}</h3>
                        <p><strong>Asking Price:</strong> $${house.price}</p>
                        <p><strong>Beds:</strong> ${house.beds} | <strong>Baths:</strong> ${house.baths}</p>
                        <p><strong>Sq Ft:</strong> ${house.square_feet}</p>
                        <button onclick="viewDetails('${house.market}', '${house.house_id}')">View Details</button>
                    </div>
                `;

                listingsContainer.appendChild(listing);
            });
        })
        .catch(error => {
            console.error("Error loading listings:", error);
        });
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
