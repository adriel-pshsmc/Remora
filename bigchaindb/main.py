#!/usr/bin/env python3
"""
Mock BigChainDB Node for Development
A simplified blockchain simulation for Remora logistics app
"""

from flask import Flask, jsonify, request
import json
import hashlib
import time
from typing import List, Dict

app = Flask(__name__)

# Simple in-memory blockchain
blockchain: List[Dict] = []
transactions: List[Dict] = []

class Block:
    def __init__(self, index: int, transactions: List[Dict], previous_hash: str):
        self.index = index
        self.timestamp = time.time()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = json.dumps({
            'index': self.index,
            'timestamp': self.timestamp,
            'transactions': self.transactions,
            'previous_hash': self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

def create_genesis_block():
    return Block(0, [], "0")

# Initialize blockchain
genesis_block = create_genesis_block()
blockchain.append({
    'index': genesis_block.index,
    'timestamp': genesis_block.timestamp,
    'transactions': genesis_block.transactions,
    'previous_hash': genesis_block.previous_hash,
    'hash': genesis_block.hash
})

@app.route('/api/v1/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    if not data or 'asset' not in data or 'metadata' not in data:
        return jsonify({'error': 'Invalid transaction data'}), 400

    transaction = {
        'id': hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest(),
        'asset': data['asset'],
        'metadata': data['metadata'],
        'timestamp': time.time()
    }

    transactions.append(transaction)
    return jsonify(transaction), 201

@app.route('/api/v1/transactions/<tx_id>', methods=['GET'])
def get_transaction(tx_id):
    for tx in transactions:
        if tx['id'] == tx_id:
            return jsonify(tx)
    return jsonify({'error': 'Transaction not found'}), 404

@app.route('/api/v1/blocks', methods=['GET'])
def get_blocks():
    return jsonify(blockchain)

@app.route('/api/v1/blocks/latest', methods=['GET'])
def get_latest_block():
    return jsonify(blockchain[-1]) if blockchain else jsonify({'error': 'No blocks'})

@app.route('/mine', methods=['POST'])
def mine_block():
    if not transactions:
        return jsonify({'error': 'No transactions to mine'}), 400

    last_block = blockchain[-1]
    new_block = Block(len(blockchain), transactions.copy(), last_block['hash'])
    blockchain.append({
        'index': new_block.index,
        'timestamp': new_block.timestamp,
        'transactions': new_block.transactions,
        'previous_hash': new_block.previous_hash,
        'hash': new_block.hash
    })

    # Clear pending transactions
    transactions.clear()

    return jsonify({
        'message': 'Block mined successfully',
        'block': blockchain[-1]
    })

@app.route('/')
def status():
    return jsonify({
        'status': 'Mock BigChainDB Node Running',
        'blocks': len(blockchain),
        'pending_transactions': len(transactions)
    })

if __name__ == '__main__':
    # Start mock server. Disable Flask's auto-reloader here so the process
    # stays in a single foreground process when started by automation.
    print("Starting Mock BigChainDB Node...")
    # Use environment variable BC_DEBUG=1 to enable debug mode if needed.
    import os
    debug_mode = os.getenv("BC_DEBUG", "0") == "1"
    app.run(host='0.0.0.0', port=9984, debug=debug_mode)