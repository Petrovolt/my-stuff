# How to Run NoteQuest

You need to run **TWO servers** at the same time:
1. **Flask Backend** (Python) - Handles file uploads and question generation
2. **Vite Frontend** (React) - The website UI

## Quick Start (Recommended)

### Option 1: Run Both Servers in Separate Terminals

**Terminal 1 - Flask Backend:**
```bash
cd /Users/eshwarbejugam/my-stuff
python app.py
```
You should see: `Running on http://127.0.0.1:5000`

**Terminal 2 - Vite Frontend:**
```bash
cd /Users/eshwarbejugam/my-stuff
npm run dev
```
You should see: `Local: http://localhost:5173` (or similar)

**Then open:** `http://localhost:5173` in your browser

---

## Step-by-Step Setup

### 1. Install Dependencies (First Time Only)

**Python dependencies:**
```bash
cd /Users/eshwarbejugam/my-stuff
pip install -r requirements.txt
```

**Node.js dependencies:**
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:
```bash
OPENROUTER_API_KEY=your_api_key_here
```

Get your API key from: https://openrouter.ai/

### 3. Run the Servers

**Start Flask Backend (Terminal 1):**
```bash
python app.py
```
- Should show: `Running on http://127.0.0.1:5000`
- Keep this terminal open

**Start Vite Frontend (Terminal 2):**
```bash
npm run dev
```
- Should show: `Local: http://localhost:5173`
- Keep this terminal open

### 4. Open the Website

Open your browser and go to: **http://localhost:5173**

---

## Troubleshooting

### Error: "Failed to load resource: 403/404"

**Problem:** Flask backend is not running

**Solution:**
1. Make sure Flask server is running in Terminal 1
2. Check that it says `Running on http://127.0.0.1:5000`
3. Try accessing `http://localhost:5000/health` in your browser - should return `{"status":"healthy"}`

### Error: "Module not found" or Import errors

**Problem:** Python dependencies not installed

**Solution:**
```bash
pip install -r requirements.txt
```

### Error: "Cannot find module" in Node

**Problem:** Node dependencies not installed

**Solution:**
```bash
npm install
```

### Port Already in Use

**Problem:** Another process is using port 5000 or 5173

**Solution:**
- For Flask (port 5000): Change `app.run(debug=True, port=5000)` to a different port in `app.py`
- For Vite (port 5173): It will automatically use the next available port

### CORS Errors

**Problem:** Flask CORS not configured properly

**Solution:** Make sure `CORS(app)` is in `app.py` (it should be there already)

---

## Development Workflow

1. **Start Flask backend** → `python app.py`
2. **Start Vite frontend** → `npm run dev`
3. **Open browser** → `http://localhost:5173`
4. **Upload file** → Should work now!
5. **Generate questions** → Wait 1-2 minutes
6. **Play game** → Click "START GAME"

---

## Production Build

To build for production:

```bash
npm run build
```

This creates a `dist/` folder with static files that can be served by Flask or any web server.

---

## Ports Used

- **Flask Backend:** `http://127.0.0.1:5000`
- **Vite Frontend:** `http://localhost:5173` (or next available port)
- **Vite Proxy:** Forwards `/upload` and `/health` to Flask backend

---

## Quick Reference

```bash
# Install dependencies (first time)
pip install -r requirements.txt
npm install

# Run Flask backend
python app.py

# Run Vite frontend (in another terminal)
npm run dev

# Open browser
# Go to: http://localhost:5173
```

