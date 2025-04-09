import os
import logging
from server import create_app, db
from server.config import Config
from server.models.models import Product, Order, Ticket

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    # Delete the existing database file if it exists
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'server', 'db.sqlite3')
    if os.path.exists(db_path):
        os.remove(db_path)
        logger.info("Removed existing database file")

    # Create the application
    app = create_app(Config)
    
    with app.app_context():
        # Create all tables
        db.create_all()
        logger.info("Database tables created successfully")

        try:
            # Add sample products
            sample_products = [
                Product(
                    name="Classic T-Shirt",
                    description="A comfortable and stylish classic t-shirt",
                    price=29.99,
                    image_url="https://example.com/tshirt.jpg",
                    category="T-Shirts",
                    sizes="S,M,L,XL",
                    stock=100
                ),
                Product(
                    name="Slim Fit Jeans",
                    description="Modern slim fit jeans with stretch",
                    price=59.99,
                    image_url="https://example.com/jeans.jpg",
                    category="Jeans",
                    sizes="28,30,32,34",
                    stock=50
                ),
                Product(
                    name="Hooded Sweatshirt",
                    description="Warm and cozy hooded sweatshirt",
                    price=49.99,
                    image_url="https://example.com/hoodie.jpg",
                    category="Sweatshirts",
                    sizes="S,M,L,XL",
                    stock=75
                )
            ]

            # Add products to database
            for product in sample_products:
                db.session.add(product)
            db.session.commit()
            logger.info("Sample products added successfully")

            # Add sample orders
            sample_orders = [
                Order(
                    product_id=1,
                    size="M",
                    quantity=2,
                    total_price=59.98
                ),
                Order(
                    product_id=2,
                    size="32",
                    quantity=1,
                    total_price=59.99
                )
            ]

            # Add orders to database
            for order in sample_orders:
                db.session.add(order)
            db.session.commit()
            logger.info("Sample orders added successfully")

            # Add sample tickets
            sample_tickets = [
                Ticket(
                    subject="Order Status Inquiry",
                    message="When will my order be shipped?",
                    status="open"
                ),
                Ticket(
                    subject="Return Request",
                    message="I would like to return my purchase",
                    status="open"
                )
            ]

            # Add tickets to database
            for ticket in sample_tickets:
                db.session.add(ticket)
            db.session.commit()
            logger.info("Sample tickets added successfully")

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error adding sample data: {str(e)}")
            raise

if __name__ == '__main__':
    init_db() 