document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("images");
    const fileDisplay = document.getElementById("file-list");
    const dropArea = document.querySelector(".file-input");
    const deleteDropdown = document.getElementById("delete-dropdown");

    // Load listings for dropdown on page load
    loadListings();

    // File selection
    fileInput.addEventListener("change", updateFileList);

    // Allow clicking drop area to open file picker
    dropArea.addEventListener("click", function () {
        fileInput.click();
    });

    // Drag & drop handling
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

    // ✅ Upload form submission
    uploadForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let formData = new FormData(uploadForm);
        formData.append("house_id", generateHouseID());

        try {
            let response = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            let result = await response.json();
            if (response.ok) {
                alert("Listing uploaded successfully!");
                uploadForm.reset();
                fileDisplay.innerHTML = "";
                loadListings(); // Refresh
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload. Please try again.");
        }
    });

    function generateHouseID() {
        return "house-" + Date.now();
    }

    function updateFileList() {
        fileDisplay.innerHTML = Array.from(fileInput.files)
            .map((file, index) => `<li>${index + 1}. ${file.name}</li>`)
            .join("");
    }
});


// ✅ Load listings from all markets
async function loadListings() {
    try {
        const markets = ["memphis", "nashville", "sanantonio", "houston", "dallas"];
        const deleteDropdown = document.getElementById("delete-dropdown");
        deleteDropdown.innerHTML = `<option value="">Select a listing to delete</option>`;

        for (const market of markets) {
            let response = await fetch(`/listings/${market}`);
            let data = await response.json();

            if (!data.listings || data.listings.length === 0) continue;

            let optgroup = document.createElement("optgroup");
            optgroup.label = market.charAt(0).toUpperCase() + market.slice(1);

            data.listings.forEach(house => {
                let option = document.createElement("option");
                option.value = house.house_id;
                option.textContent = house.address;
                optgroup.appendChild(option);
            });

            deleteDropdown.appendChild(optgroup);
        }

        if (deleteDropdown.children.length === 1) {
            deleteDropdown.innerHTML += `<option value="">No listings available</option>`;
        }
    } catch (error) {
        console.error("Error loading listings:", error);
    }
}


// ✅ Delete listing
async function deleteSelectedListing() {
    const deleteDropdown = document.getElementById("delete-dropdown");
    const houseId = deleteDropdown.value;

    if (!houseId) {
        alert("Please select a listing to delete.");
        return;
    }

    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
        return;
    }

    try {
        let response = await fetch(`/delete/${houseId}`, { method: "DELETE" });
        let result = await response.json();

        if (response.ok) {
            alert("Listing deleted successfully!");
            loadListings(); // Refresh
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing. Please try again.");
    }
}
