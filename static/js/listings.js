document.addEventListener("DOMContentLoaded", function () {
    const market = window.location.pathname.includes("texas") ? "texas" : "tennessee";
    fetchListings(market);
});

function fetchListings(market) {
    fetch(`/listings/${market}`)
        .then(response => response.json())
        .then(data => {
            const listingsContainer = document.getElementById("listings-container");
            listingsContainer.innerHTML = "";

            data.listings.forEach(house => {
                const listing = document.createElement("div");
                listing.classList.add("listing");

                listing.innerHTML = `
                    <img src="${house.image_urls[0]}" alt="House Image">
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
        .catch(error => console.error("Error loading listings:", error));
}
