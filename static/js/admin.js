document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("images");
    const fileDisplay = document.getElementById("file-list");
    const dropArea = document.querySelector(".file-input");
    const listingsContainer = document.getElementById("listings");

    loadListings(); // Load existing listings

    fileInput.addEventListener("change", updateFileList);

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = "#d0e7ff";
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.style.backgroundColor = "#e6f0ff";
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = "#e6f0ff";

        let files = event.dataTransfer.files;
        fileInput.files = files;
        updateFileList();
    });

    uploadForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let formData = new FormData(uploadForm);
        formData.append("house_id", generateHouseID());

        try {
            let response = await fetch("/upload", { method: "POST", body: formData });
            let result = await response.json();

            if (response.ok) {
                alert("Listing uploaded successfully!");
                uploadForm.reset();
                fileDisplay.innerHTML = "";
                loadListings(); // Reload listings after upload
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload. Please try again.");
        }
    });

    // Load listings when admin page loads
    loadListings();

    function generateHouseID() {
        return "house-" + Date.now();
    }

    function updateFileList() {
        fileDisplay.innerHTML = Array.from(fileInput.files)
            .map((file, index) => `<li>${index + 1}. ${file.name}</li>`)
            .join("");
    }
});

// ✅ **Fix: Move `deleteListing` Outside `DOMContentLoaded`**
async function deleteListing(houseId) {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
        return; // User canceled the deletion
    }

    try {
        let response = await fetch(`/delete/${houseId}`, { method: "DELETE" });
        let result = await response.json();

        if (response.ok) {
            alert("Listing deleted successfully!");
            loadListings(); // Refresh the listings
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing. Please try again.");
    }
}

// ✅ **Fix: Ensure Listings Are Loaded**
async function loadListings() {
    try {
        let response = await fetch("/listings/texas"); // Load Texas listings by default
        let data = await response.json();

        const container = document.getElementById("listings");
        container.innerHTML = ""; // Clear previous listings

        if (!data.listings || data.listings.length === 0) {
            container.innerHTML = "<p>No listings found.</p>";
            return;
        }

        data.listings.forEach(house => {
            const listing = document.createElement("div");
            listing.classList.add("listing");

            let imageUrl = house.image_urls.length > 0 ? house.image_urls[0] : "static/images/placeholder.png";

            listing.innerHTML = `
                <div class="listing-container">
                    <img src="${imageUrl}" alt="House Image" class="listing-image">
                    <div class="listing-content">
                        <p class="listing-address">${house.address}</p>
                        <p><strong>Asking Price:</strong> $${house.price}</p>
                        <p><strong>Beds:</strong> ${house.beds} | <strong>Baths:</strong> ${house.baths}</p>
                        <p><strong>Square Feet:</strong> ${house.square_feet} sqft</p>
                        <button class="delete-btn" onclick="deleteListing('${house.house_id}')">Delete</button>
                    </div>
                </div>
            `;
            container.appendChild(listing);
        });
    } catch (error) {
        console.error("Error loading listings:", error);
    }
}
