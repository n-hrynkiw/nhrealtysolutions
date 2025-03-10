document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const market = params.get("market");
    const houseId = params.get("house_id");

    fetch(`/house/${market}/${houseId}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("house-details").innerHTML = `<h2>${data.address}</h2><p>${data.price}</p>`;
    });
});

function goBack() {
    window.history.back();
}
