from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import shutil

app = Flask(__name__)
CORS(app)

BASE_UPLOAD_FOLDER = 'markets'

# Ensure base folder exists
if not os.path.exists(BASE_UPLOAD_FOLDER):
    os.makedirs(BASE_UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/markets', methods=['GET'])
def get_markets():
    """Returns a list of available markets"""
    markets = [market for market in os.listdir(BASE_UPLOAD_FOLDER) if os.path.isdir(os.path.join(BASE_UPLOAD_FOLDER, market))]
    return jsonify({'markets': markets}), 200

@app.route('/<path:filename>')
def serve_static_files(filename):
    return send_from_directory('.', filename)

@app.route('/listings/<market>', methods=['GET'])
def get_listings(market):
    """Fetch all house listings for a given market"""
    market_path = os.path.join(BASE_UPLOAD_FOLDER, market)
    if not os.path.exists(market_path):
        return jsonify({'error': 'Market not found'}), 404

    listings = []
    for house_id in os.listdir(market_path):
        house_path = os.path.join(market_path, house_id)
        details_path = os.path.join(house_path, 'details.json')

        if os.path.isdir(house_path) and os.path.exists(details_path):
            with open(details_path, 'r', encoding='utf-8') as f:
                details = json.load(f)

            # Find all image files in the house folder
            image_files = [file for file in os.listdir(house_path) if file.endswith(('.png', '.jpg', '.jpeg', '.gif'))]
            image_urls = [f"/markets/{market}/{house_id}/{img}" for img in image_files]

            # Add listing details with images
            listings.append({
                'house_id': house_id,
                'image_urls': image_urls,  # Send image URLs to frontend
                **details
            })

    return jsonify({'listings': listings}), 200

@app.route('/upload', methods=['POST'])
def upload_files():
    """Handles file uploads for a new listing"""
    market = request.form.get('market')
    house_id = request.form.get('house_id')

    if not market or not house_id:
        return jsonify({'error': 'Market and house_id are required'}), 400

    house_folder = os.path.join(BASE_UPLOAD_FOLDER, market, house_id)
    os.makedirs(house_folder, exist_ok=True)

    for file in request.files.getlist('file'):
        if file and allowed_file(file.filename):
            filename = file.filename
            file.save(os.path.join(house_folder, filename))
    
    details = {
        "address": request.form.get("address", "N/A"),
        "asking_price": request.form.get("asking_price", "N/A"),
        "beds": request.form.get("beds", "N/A"),
        "baths": request.form.get("baths", "N/A"),
        "square_feet": request.form.get("square_feet", "N/A"),
        "description": request.form.get("description", "N/A")
    }

    with open(os.path.join(house_folder, 'details.json'), 'w', encoding='utf-8') as f:
        json.dump(details, f, indent=4)

    return jsonify({'message': 'Upload successful'}), 200

@app.route('/delete/<market>/<house_id>', methods=['DELETE'])
def delete_listing(market, house_id):
    """Deletes a listing"""
    house_folder = os.path.join(BASE_UPLOAD_FOLDER, market, house_id)

    if os.path.exists(house_folder):
        shutil.rmtree(house_folder)
        return jsonify({'message': 'Listing deleted successfully'}), 200

    return jsonify({'error': 'Listing not found'}), 404

@app.route('/house/<market>/<house_id>', methods=['GET'])
def get_house_details(market, house_id):
    """Returns details and images for a specific house"""
    house_folder = os.path.join(BASE_UPLOAD_FOLDER, market, house_id)
    details_path = os.path.join(house_folder, 'details.json')

    if not os.path.exists(details_path):
        return jsonify({'error': 'House not found'}), 404

    with open(details_path, 'r', encoding='utf-8') as f:
        details = json.load(f)

    # Get all image files in the house folder
    image_files = [file for file in os.listdir(house_folder) if file.endswith(('.png', '.jpg', '.jpeg', '.gif'))]
    image_urls = [f"/markets/{market}/{house_id}/{img}" for img in image_files]

    return jsonify({
        'house_id': house_id,
        'address': details.get('address', 'N/A'),
        'price': details.get('asking_price', 'N/A'),
        'beds': details.get('beds', 'N/A'),
        'baths': details.get('baths', 'N/A'),
        'square_feet': details.get('square_feet', 'N/A'),
        'details': details.get('description', 'N/A'),
        'image_urls': image_urls  # Fix: Ensure images are returned
    })


if __name__ == '__main__':
    app.run(debug=True)
