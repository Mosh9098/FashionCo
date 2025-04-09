from flask import Blueprint, request, jsonify
from ..db import db, Ticket
import logging

logger = logging.getLogger(__name__)
tickets_bp = Blueprint('tickets', __name__)

@tickets_bp.route('/tickets', methods=['GET'])
def get_tickets():
    try:
        tickets = Ticket.query.all()
        return jsonify([{
            "id": t.id,
            "subject": t.subject,
            "message": t.message,
            "created_at": t.created_at.isoformat(),
            "status": t.status
        } for t in tickets])
    except Exception as e:
        logger.error(f"Error getting tickets: {str(e)}")
        return jsonify({"error": "Failed to get tickets"}), 500

@tickets_bp.route('/tickets', methods=['POST'])
def add_ticket():
    try:
        data = request.json
        if not data or 'subject' not in data or 'message' not in data:
            return jsonify({"error": "Missing required fields"}), 400

        ticket = Ticket(
            subject=data['subject'],
            message=data['message'],
            status=data.get('status', 'open')
        )
        db.session.add(ticket)
        db.session.commit()
        return jsonify({"message": "Ticket added", "id": ticket.id}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding ticket: {str(e)}")
        return jsonify({"error": "Failed to add ticket"}), 500

@tickets_bp.route('/tickets/<int:id>', methods=['PUT'])
def update_ticket(id):
    try:
        ticket = Ticket.query.get_or_404(id)
        data = request.json

        if 'status' in data:
            ticket.status = data['status']
        if 'subject' in data:
            ticket.subject = data['subject']
        if 'message' in data:
            ticket.message = data['message']

        db.session.commit()
        return jsonify({"message": "Ticket updated"})
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating ticket: {str(e)}")
        return jsonify({"error": "Failed to update ticket"}), 500

@tickets_bp.route('/tickets/<int:id>', methods=['DELETE'])
def delete_ticket(id):
    try:
        ticket = Ticket.query.get_or_404(id)
        db.session.delete(ticket)
        db.session.commit()
        return jsonify({"message": "Ticket deleted"})
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting ticket: {str(e)}")
        return jsonify({"error": "Failed to delete ticket"}), 500
