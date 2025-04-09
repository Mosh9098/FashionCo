from flask import Flask
from flask_cors import CORS
import logging
from .config import Config
from .db import db, Product, Order, Ticket

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    logger.info(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")

    # Initialize extensions with app
    db.init_app(app)
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register blueprints
    from .routes.products import products_bp
    from .routes.orders import orders_bp
    from .routes.tickets import tickets_bp

    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(tickets_bp, url_prefix='/api')

    # Create database tables
    with app.app_context():
        try:
            # Log all tables that will be created
            tables = [table.__tablename__ for table in db.Model.__subclasses__()]
            logger.info(f"Tables to be created: {tables}")
            
            db.create_all()
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            created_tables = inspector.get_table_names()
            logger.info(f"Created tables: {created_tables}")
            
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {str(e)}")
            raise

    return app 