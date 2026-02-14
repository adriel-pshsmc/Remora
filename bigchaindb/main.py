#!/usr/bin/env python3
"""
BigChainDB Remora Node Main Entry Point
"""

from bigchaindb import config
from bigchaindb.core import BigchainDB
from bigchaindb.web import server

def main():
    # Initialize BigChainDB
    bdb = BigchainDB()

    # Start the web server
    app = server.create_app()
    app.run(host='0.0.0.0', port=9984, debug=True)

if __name__ == '__main__':
    main()