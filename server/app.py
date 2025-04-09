from . import create_app
from .config import Config
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    try:
        app = create_app(Config)
        # Try different ports if 5000 is in use
        port = 5000
        while port < 5010:  # Try ports 5000-5009
            try:
                app.run(debug=True, port=port)
                break
            except OSError as e:
                if "Address already in use" in str(e):
                    logger.warning(f"Port {port} is in use, trying port {port + 1}")
                    port += 1
                else:
                    raise
        if port >= 5010:
            logger.error("Could not find an available port between 5000 and 5009")
            sys.exit(1)
    except Exception as e:
        logger.error(f"Error starting the application: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
