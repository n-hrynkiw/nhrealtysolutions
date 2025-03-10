from cloudinary_setup import upload_image

# Replace "your-image.jpg" with an actual image in your project folder
image_url = upload_image("test.jpeg")

if image_url:
    print("Uploaded Image URL:", image_url)
else:
    print("Upload failed!")
