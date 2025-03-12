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
                alert("✅ " + result.message);
                uploadForm.reset();
                fileDisplay.innerHTML = "";
                loadListings(); // Reload listings after upload
            } else {
                alert("❌ Error: " + result.error);
            }
        } catch (error) {
            console.error("❌ Upload error:", error);
            alert("Failed to upload. Please try again.");
        }
    });

    async function loadListings() {
        try {
            let response = await fetch("/admin/listings");
            let data = await response.json();

            listingsContainer.innerHTML = "";
            if (data.listings.length === 0) {
                listingsContainer.innerHTML = "<p>No listings available.</p>";
                return;
            }

            data.listings.forEach(house => {
                let listing = document.createElement("div");
                listing.classList.add("listing");
                listing.innerHTML = `
                    <p>${house.address} - $${house.price}</p>
                    <button class="delete-btn" onclick="deleteListing('${house.house_id}')">Delete</button>
                `;
                listingsContainer.appendChild(listing);
            });
        } catch (error) {
            console.error("Error loading listings:", error);
        }
    }

    async function deleteListing(houseId) {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        let response = await fetch(`/delete/${houseId}`, { method: "DELETE" });

        if (response.ok) {
            alert("Listing deleted successfully.");
            loadListings();
        } else {
            alert("Failed to delete listing.");
        }
    }

    function generateHouseID() {
        return "house-" + Date.now();
    }

    function updateFileList() {
        fileDisplay.innerHTML = Array.from(fileInput.files)
            .map((file, index) => `<li>${index + 1}. ${file.name}</li>`)
            .join("");
    }
});
