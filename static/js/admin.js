document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("images");

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
            alert(result.message || "Upload failed!");

            if (response.ok) {
                uploadForm.reset(); // Clear the form on success
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload. Please try again.");
        }
    });

    function generateHouseID() {
        return "house-" + Date.now(); // Generates a unique house ID
    }

    // Display selected file names
    fileInput.addEventListener("change", function () {
        const fileList = Array.from(fileInput.files).map(file => file.name).join(", ");
        document.querySelector(".file-input span").innerText = fileList || "Click or Drag Images Here";
    });
});
