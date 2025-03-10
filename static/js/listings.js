document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => loadListings("texas"), 200); // Ensure DOM is fully loaded
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
                        <p><strong>Price:</strong> $${house.price}</p>
                        <p><strong>Beds:</strong> ${house.beds} | <strong>Baths:</strong> ${house.baths}</p>
                        <p><strong>Sq Ft:</strong> ${house.square_feet}</p>
                        <p>${house.details}</p>
                    </div>
                `;

                listingsContainer.appendChild(listing);
            });
        })
        .catch(error => {
            console.error("Error loading listings:", error);
        });
}

// Change market when clicking a button
function changeMarket(market) {
    document.getElementById("listings-frame").src = `${market}.html`;
    setTimeout(() => loadListings(market), 500); // Delay loading to ensure iframe updates
}
