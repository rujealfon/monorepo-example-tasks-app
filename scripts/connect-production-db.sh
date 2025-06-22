#!/bin/bash

# Helper script to connect to production PostgreSQL database on fly.io

echo "🚀 Connecting to production database..."
echo "App: api-fragrant-cherry-5252"
echo "Database: api-fragrant-cherry-5252-db"
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if authenticated
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Not authenticated with fly.io. Please run:"
    echo "flyctl auth login"
    exit 1
fi

echo "📡 Opening direct connection to production database..."
echo "Type 'exit' or press Ctrl+D to disconnect"
echo ""

flyctl postgres connect -a api-fragrant-cherry-5252-db