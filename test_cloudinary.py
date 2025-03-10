from cloudinary_setup import upload_image

# Test image upload
image_url = upload_image("https://via.placeholder.com/300")

if image_url:
    print("Uploaded Image URL:", image_url)
else:
    print("Upload failed!")
