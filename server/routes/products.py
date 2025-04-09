from flask import Blueprint, request, jsonify
from ..db import db, Product
import logging

logger = logging.getLogger(__name__)
products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "image_url": p.image_url,
            "category": p.category,
            "sizes": p.sizes.split(",") if p.sizes else [],
            "stock": p.stock
        } for p in products])
    except Exception as e:
        logger.error(f"Error getting products: {str(e)}")
        return jsonify({"error": "Failed to get products"}), 500

@products_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    try:
        product = Product.query.get_or_404(id)
        return jsonify({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image_url": product.image_url,
            "category": product.category,
            "sizes": product.sizes.split(",") if product.sizes else [],
            "stock": product.stock
        })
    except Exception as e:
        logger.error(f"Error getting product: {str(e)}")
        return jsonify({"error": "Product not found"}), 404

@products_bp.route('/products', methods=['POST'])
def add_product():
    try:
        data = request.json
        if not data or 'name' not in data or 'price' not in data:
            return jsonify({"error": "Missing required fields"}), 400

        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            image_url=data.get('image_url', ''),
            category=data.get('category', ''),
            sizes=','.join(data.get('sizes', [])),
            stock=data.get('stock', 0)
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({"message": "Product added", "id": product.id}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding product: {str(e)}")
        return jsonify({"error": "Failed to add product"}), 500

@products_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    try:
        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted"})
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting product: {str(e)}")
        return jsonify({"error": "Failed to delete product"}), 500
