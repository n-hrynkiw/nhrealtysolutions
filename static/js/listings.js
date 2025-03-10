document.addEventListener("DOMContentLoaded", function() {
    const market = document.title.includes("Texas") ? "texas" : "tennessee";

    fetch(`/listings/${market}`)
    .then(response => response.json())
    .then(data => {
        const listingsDiv = document.getElementById("listings");
        data.listings.forEach(house => {
            const div = document.createElement("div");
            div.innerHTML = `<h3>${house.address}</h3><p>${house.price}</p>`;
            div.onclick = () => window.location.href = `house.html?market=${market}&house_id=${house.house_id}`;
            listingsDiv.appendChild(div);
        });
    });
});
