import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure PostgreSQL Database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL").replace("postgres://", "postgresql://")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# House Model
class House(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    house_id = db.Column(db.String, unique=True, nullable=False)
    market = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    price = db.Column(db.String, nullable=False)
    beds = db.Column(db.String, nullable=False)
    baths = db.Column(db.String, nullable=False)
    square_feet = db.Column(db.String, nullable=False)
    details = db.Column(db.Text, nullable=False)
    image_urls = db.Column(db.ARRAY(db.String), nullable=False)

# Create the tables
def init_db():
    with app.app_context():
        db.create_all()

if __name__ == "__main__":
    init_db()
    print("Database initialized!")
