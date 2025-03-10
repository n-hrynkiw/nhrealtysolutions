document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("images");
    const fileDisplay = document.getElementById("file-list");
    const dropArea = document.getElementById("drop-area");

    // 📌 Clicking on Drop Area should open File Input
    dropArea.addEventListener("click", function () {
        fileInput.click();
    });

    // 📌 Handle file selection via clicking
    fileInput.addEventListener("change", function () {
        updateFileList();
    });

    // 📌 Drag-and-Drop Support
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
        let dataTransfer = new DataTransfer();

        for (let file of files) {
            dataTransfer.items.add(file);
        }

        fileInput.files = dataTransfer.files; // Assign dropped files to input
        updateFileList(); // ✅ Update the file list
    });

    // 📌 Handle Form Submission
    uploadForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let formData = new FormData(uploadForm);
        let houseID = generateHouseID();
        formData.append("house_id", houseID);

        if (fileInput.files.length === 0) {
            alert("Please add at least one image.");
            return;
        }

        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append("images", fileInput.files[i]);
        }

        console.log("📤 Submitting form data..."); // ✅ Debugging Log
        console.log("🖼️ Files Selected:", fileInput.files);

        try {
            let response = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            let result = await response.json();
            console.log("✅ Upload Response:", result); // ✅ Debugging Log

            if (response.ok) {
                alert("Upload successful!");
                uploadForm.reset(); // Clear the form
                fileDisplay.innerHTML = "<li>No files selected.</li>"; // Clear file list display
            } else {
                alert(result.message || "Upload failed. Please check logs.");
            }
        } catch (error) {
            console.error("❌ Upload error:", error);
            alert("Failed to upload. Please check console logs.");
        }
    });

    // 📌 Generate Unique House ID
    function generateHouseID() {
        return "house-" + Date.now();
    }

    // 📌 Update File List Display
    function updateFileList() {
        let files = fileInput.files;
        fileDisplay.innerHTML = "";

        if (files.length > 0) {
            Array.from(files).forEach((file, index) => {
                let listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${file.name}`;
                fileDisplay.appendChild(listItem);
            });
        } else {
            fileDisplay.innerHTML = "<li>No files selected.</li>";
        }

        console.log("📄 Files Added:", files); // ✅ Debugging Log
    }
});
