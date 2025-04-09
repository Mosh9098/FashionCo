from flask import Blueprint, request, jsonify
from ..db import db, Order, Product
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)
orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify([{
            "id": o.id,
            "product_id": o.product_id,
            "size": o.size,
            "quantity": o.quantity,
            "total_price": o.total_price,
            "order_date": o.order_date.isoformat()
        } for o in orders])
    except Exception as e:
        logger.error(f"Error getting orders: {str(e)}")
        return jsonify({"error": "Failed to get orders"}), 500

@orders_bp.route('/orders', methods=['POST'])
def add_order():
    try:
        data = request.json
        if not data or 'product_id' not in data or 'size' not in data or 'quantity' not in data:
            return jsonify({"error": "Missing required fields"}), 400

        # Check if product exists and has enough stock
        product = Product.query.get_or_404(data['product_id'])
        if product.stock < data['quantity']:
            return jsonify({"error": "Not enough stock"}), 400

        # Calculate total price
        total_price = product.price * data['quantity']

        order = Order(
            product_id=data['product_id'],
            size=data['size'],
            quantity=data['quantity'],
            total_price=total_price
        )
        
        # Update product stock
        product.stock -= data['quantity']
        
        db.session.add(order)
        db.session.commit()
        return jsonify({"message": "Order added", "id": order.id}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding order: {str(e)}")
        return jsonify({"error": "Failed to add order"}), 500

@orders_bp.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    try:
        order = Order.query.get_or_404(id)
        
        # Restore product stock
        product = Product.query.get(order.product_id)
        if product:
            product.stock += order.quantity
        
        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "Order deleted"})
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting order: {str(e)}")
        return jsonify({"error": "Failed to delete order"}), 500

@orders_bp.route('/orders/stats', methods=['GET'])
def sales_stats():
    now = datetime.utcnow()

    def sum_sales(start, end):
        return db.session.query(db.func.sum(Order.total_price)).filter(Order.order_date.between(start, end)).scalar() or 0

    return jsonify({
        "today": sum_sales(now.replace(hour=0, minute=0), now),
        "week": sum_sales(now - timedelta(days=7), now),
        "month": sum_sales(now - timedelta(days=30), now),
        "year": sum_sales(now - timedelta(days=365), now),
    })
