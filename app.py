import os
import cloudinary
import cloudinary.uploader
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Cloudinary configuration (Replace with your Cloudinary credentials)
cloudinary.config(
    cloud_name="your_cloud_name",
    api_key="your_api_key",
    api_secret="your_api_secret"
)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///houses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the House model (stores house details)
class House(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    house_id = db.Column(db.String(50), unique=True, nullable=False)
    market = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(50), nullable=False)
    beds = db.Column(db.String(10), nullable=False)
    baths = db.Column(db.String(10), nullable=False)
    square_feet = db.Column(db.String(20), nullable=False)
    details = db.Column(db.Text, nullable=False)
    image_urls = db.Column(db.Text, nullable=False)  # Store image URLs as a comma-separated string

# Create the database tables (only runs once)
with app.app_context():
    db.create_all()

@app.route('/upload', methods=['POST'])
def upload_house():
    """Uploads a new house listing with images."""
    data = request.form
    files = request.files.getlist('images')

    if not data.get("address") or not files:
        return jsonify({"error": "Missing required fields"}), 400

    # Upload images to Cloudinary
    image_urls = []
    for file in files:
        response = cloudinary.uploader.upload(file)
        image_urls.append(response["secure_url"])

    # Save house details in SQLite database
    new_house = House(
        house_id=data.get("house_id"),
        market=data.get("market"),
        address=data.get("address"),
        price=data.get("price"),
        beds=data.get("beds"),
        baths=data.get("baths"),
        square_feet=data.get("square_feet"),
        details=data.get("details"),
        image_urls=",".join(image_urls)  # Store as comma-separated string
    )

    db.session.add(new_house)
    db.session.commit()

    return jsonify({"message": "House uploaded successfully", "house_id": new_house.house_id})

@app.route('/listings/<market>', methods=['GET'])
def get_listings(market):
    """Returns all houses for a specific market."""
    houses = House.query.filter_by(market=market).all()
    listings = []

    for house in houses:
        listings.append({
            "house_id": house.house_id,
            "address": house.address,
            "price": house.price,
            "beds": house.beds,
            "baths": house.baths,
            "square_feet": house.square_feet,
            "details": house.details,
            "image_urls": house.image_urls.split(",")  # Convert back to list
        })

    return jsonify({"listings": listings})

@app.route('/house/<market>/<house_id>', methods=['GET'])
def get_house_details(market, house_id):
    """Returns details of a specific house."""
    house = House.query.filter_by(market=market, house_id=house_id).first()
    if not house:
        return jsonify({'error': 'House not found'}), 404

    return jsonify({
        "house_id": house.house_id,
        "address": house.address,
        "price": house.price,
        "beds": house.beds,
        "baths": house.baths,
        "square_feet": house.square_feet,
        "details": house.details,
        "image_urls": house.image_urls.split(",")  # Convert back to list
    })

@app.route('/delete/<house_id>', methods=['DELETE'])
def delete_listing(house_id):
    """Deletes a house listing and removes its images from Cloudinary."""
    house = House.query.filter_by(house_id=house_id).first()
    if not house:
        return jsonify({'error': 'House not found'}), 404

    # Delete images from Cloudinary
    image_urls = house.image_urls.split(",")
    for url in image_urls:
        public_id = url.split("/")[-1].split(".")[0]  # Extract public ID from URL
        cloudinary.uploader.destroy(public_id)

    # Remove house from database
    db.session.delete(house)
    db.session.commit()

    return jsonify({"message": "House deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
