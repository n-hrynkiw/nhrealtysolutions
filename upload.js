document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("houseId").value = "house-" + Date.now();
    loadMarkets();

    let dropZone = document.getElementById("dropZone");
    let fileInput = document.getElementById("fileInput");
    let fileList = document.getElementById("fileList"); // Create a place to show selected files

    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        fileInput.files = e.dataTransfer.files;
        displayFileNames(fileInput.files);
    });

    fileInput.addEventListener("change", function() {
        displayFileNames(fileInput.files);
    });
});

// Function to list selected files
function displayFileNames(files) {
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = ""; // Clear previous list

    if (files.length === 0) {
        fileList.innerHTML = "<p>No files selected.</p>";
        return;
    }

    let list = document.createElement("ul");
    for (let i = 0; i < files.length; i++) {
        let listItem = document.createElement("li");
        listItem.textContent = files[i].name;
        list.appendChild(listItem);
    }
    fileList.appendChild(list);
}

function loadMarkets() {
    fetch("/markets")
    .then(response => response.json())
    .then(data => {
        let marketDropdown = document.getElementById("market");
        let deleteMarketDropdown = document.getElementById("deleteMarket");

        marketDropdown.innerHTML = "";
        deleteMarketDropdown.innerHTML = "";

        data.markets.forEach(market => {
            let option1 = document.createElement("option");
            option1.value = market;
            option1.textContent = market;
            marketDropdown.appendChild(option1);

            let option2 = document.createElement("option");
            option2.value = market;
            option2.textContent = market;
            deleteMarketDropdown.appendChild(option2);
        });
    })
    .catch(error => console.error("Error loading markets:", error));
}

function uploadFiles() {
    let market = document.getElementById("market").value;
    let houseId = document.getElementById("houseId").value;
    let files = document.getElementById("fileInput").files;

    if (!market || files.length === 0) {
        alert("Please select a market and upload files.");
        return;
    }

    let formData = new FormData();
    formData.append("market", market);
    formData.append("house_id", houseId);
    formData.append("address", document.getElementById("address").value);
    formData.append("asking_price", document.getElementById("asking_price").value);
    formData.append("beds", document.getElementById("beds").value);
    formData.append("baths", document.getElementById("baths").value);
    formData.append("square_feet", document.getElementById("square_feet").value);
    formData.append("description", document.getElementById("description").value);

    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
    }

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("fileList").innerHTML = "<p>Files uploaded successfully!</p>"; // Clear file list after upload
    })
    .catch(error => console.error("Error uploading files:", error));
}

function loadListingsForDeletion() {
    let market = document.getElementById("deleteMarket").value;
    if (!market) return;

    fetch(`/listings/${market}`)
    .then(response => response.json())
    .then(data => {
        let listingsDropdown = document.getElementById("deleteHouse");
        listingsDropdown.innerHTML = "<option value=''>Select Listing</option>";

        data.listings.forEach(listing => {
            let option = document.createElement("option");
            option.value = listing.house_id;
            option.textContent = listing.address || "Unnamed Listing";
            listingsDropdown.appendChild(option);
        });
    })
    .catch(error => console.error("Error loading listings:", error));
}

function deleteListing() {
    let market = document.getElementById("deleteMarket").value;
    let houseId = document.getElementById("deleteHouse").value;

    if (!market || !houseId) {
        alert("Please select a market and a listing.");
        return;
    }

    fetch(`/delete/${market}/${houseId}`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadListingsForDeletion(); // Refresh listings
    })
    .catch(error => console.error("Error deleting listing:", error));
}
