#!/bin/bash

# Start NoteQuest - Run both Flask and Vite servers

echo "🚀 Starting NoteQuest..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Create one with your OPENROUTER_API_KEY"
    echo "   Example: OPENROUTER_API_KEY=your_key_here"
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    echo ""
fi

echo "🔧 Starting Flask backend on http://127.0.0.1:5000"
echo "🌐 Starting Vite frontend (will open in browser)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start Flask in background
python3 app.py &
FLASK_PID=$!

# Wait a moment for Flask to start
sleep 2

# Start Vite (this will block)
npm run dev

# When Vite stops, kill Flask
kill $FLASK_PID 2>/dev/null

echo ""
echo "👋 Servers stopped"

