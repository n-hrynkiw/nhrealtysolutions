import os
import cloudinary
import cloudinary.uploader

# Load Cloudinary settings from environment variables
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Function to upload images
def upload_image(image_path):
    try:
        response = cloudinary.uploader.upload(image_path)
        return response["secure_url"]
    except Exception as e:
        print("Cloudinary upload failed:", e)
        return None
