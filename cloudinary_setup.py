import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_image(image_file):
    if image_file and image_file.filename:
        try:
            upload_result = cloudinary.uploader.upload(image_file)
            return upload_result.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload failed: {str(e)}")
            return None
    return None
