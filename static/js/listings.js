document.addEventListener("DOMContentLoaded", async function () {
    const listingsContainer = document.getElementById("listings");
    const market = window.location.pathname.includes("texas") ? "texas" : "tennessee";

    try {
        let response = await fetch(`/listings/${market}`);
        let data = await response.json();

        if (!data.listings || data.listings.length === 0) {
            listingsContainer.innerHTML = "<p>No listings available.</p>";
            return;
        }

        listingsContainer.innerHTML = "";
        data.listings.forEach(house => {
            let houseCard = document.createElement("div");
            houseCard.classList.add("house-card");

            houseCard.innerHTML = `
                <img src="${house.image_urls[0] || 'https://via.placeholder.com/300'}" alt="House Image">
                <h3>${house.address}</h3>
                <p>Price: ${house.price}</p>
                <p>Beds: ${house.beds} | Baths: ${house.baths}</p>
                <p>Sq Ft: ${house.square_feet}</p>
                <button onclick="viewHouse('${house.market}', '${house.house_id}')">View Details</button>
            `;

            listingsContainer.appendChild(houseCard);
        });

    } catch (error) {
        console.error("❌ Error loading listings:", error);
        listingsContainer.innerHTML = "<p>Error loading listings. Please try again later.</p>";
    }
});

function viewHouse(market, houseId) {
    window.location.href = `/house.html?market=${market}&house_id=${houseId}`;
}
