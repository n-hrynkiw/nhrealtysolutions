from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from database_setup import db, House
from cloudinary_setup import upload_image
import time

app = Flask(__name__)
CORS(app)

# Ensure database is initialized
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/texas.html')
def texas():
    return render_template("texas.html")

@app.route('/tennessee.html')
def tennessee():
    return render_template("tennessee.html")

@app.route('/house.html')
def house():
    return render_template("house.html")

@app.route('/admin.html')
def admin():
    return render_template("admin.html")

# ✅ **Fix: Initialize the database properly**
with app.app_context():
    db.create_all()

# ✅ **Get Listings**
@app.route('/listings/<market>')
def get_listings(market):
    houses = House.query.filter_by(market=market).all()
    return jsonify({"listings": [house.__dict__ for house in houses]})

# ✅ **Get House Details**
@app.route('/house/<market>/<house_id>')
def get_house(market, house_id):
    house = House.query.filter_by(market=market, house_id=house_id).first()
    return jsonify(house.__dict__) if house else jsonify({"error": "House not found"}), 404

# ✅ **Fixed Upload House**
@app.route('/upload', methods=['POST'])
def upload_house():
    try:
        data = request.form
        images = request.files.getlist('images')

        if not data.get("market") or not data.get("address"):
            return jsonify({"error": "Missing required fields"}), 400

        house_id = data.get("house_id", f"house-{int(time.time())}")

        if not images or len(images) == 0:
            return jsonify({"error": "No images uploaded"}), 400

        image_urls = []
        for image in images:
            if image.filename:  # ✅ Ensure file is not empty
                uploaded_url = upload_image(image)
                if uploaded_url:
                    image_urls.append(uploaded_url)
                else:
                    return jsonify({"error": "Image upload failed"}), 500

        house = House(
            house_id=house_id,
            market=data['market'],
            address=data['address'],
            price=data['price'],
            beds=data['beds'],
            baths=data['baths'],
            square_feet=data['square_feet'],
            details=data['details'],
            image_urls=image_urls
        )

        db.session.add(house)
        db.session.commit()

        return jsonify({"message": "House uploaded successfully!", "house_id": house_id, "image_urls": image_urls}), 201

    except Exception as e:
        print("❌ Upload Error:", str(e))  # ✅ Log error
        return jsonify({"error": "Server error", "details": str(e)}), 500

# ✅ **Delete House**
@app.route('/delete/<house_id>', methods=['DELETE'])
def delete_house(house_id):
    house = House.query.filter_by(house_id=house_id).first()
    if house:
        db.session.delete(house)
        db.session.commit()
        return jsonify({"message": "House deleted!"})
    return jsonify({"error": "House not found"}), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10000, debug=True, use_reloader=False)
