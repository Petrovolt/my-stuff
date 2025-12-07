# How to Play NoteQuest

## Quick Start Guide

### Step 1: Generate Questions from Your Website

1. **Start the Flask server:**
   ```bash
   cd /Users/eshwarbejugam/my-stuff
   python app.py
   ```

2. **Open your browser:**
   - Go to `http://localhost:5000/play`
   - Or click "PLAY" from the homepage

3. **Upload your notes:**
   - Click the upload area or drag and drop a PDF/Word document
   - Supported formats: PDF, DOC, DOCX

4. **Generate questions:**
   - Click "Generate Questions"
   - Wait for processing (may take 1-2 minutes)

5. **Download the JSON file:**
   - Once generated, click "Download Questions JSON"
   - Save it as `questions.json` in the `GoDot/` folder

### Step 2: Run the Game in Godot

1. **Open Godot Editor:**
   - Open Godot (version 4.5 or higher)
   - Click "Import" or "Open"
   - Navigate to `/Users/eshwarbejugam/my-stuff/GoDot/`
   - Select `project.godot`

2. **Verify the questions file:**
   - In the FileSystem panel (bottom left), make sure `questions.json` is visible
   - If not, copy your downloaded `questions.json` into the `GoDot/` folder

3. **Run the game:**
   - Click the "Play" button (▶) in the top-right corner
   - Or press `F5`

### Step 3: Play the Game

1. **Start the game:**
   - You'll see the menu screen with "NoteQuest" title
   - Click the "START" button

2. **Answer questions:**
   - A popup will appear with a question
   - Click one of the 4 answer options (A, B, C, or D)
   - The selected answer will turn:
     - **Green** if correct
     - **Red** if wrong
   - The correct answer will always be highlighted in green

3. **Read the explanation:**
   - After selecting an answer, an explanation appears below
   - Read why the answer is correct

4. **Continue to next question:**
   - Click the "Close" button
   - The next question will appear automatically

5. **Boss fights:**
   - Every 10 questions, you'll get a boss fight notification
   - (You can add boss fight logic later)

6. **Game completion:**
   - When all questions are answered, you'll see your final score
   - The START button will reappear to play again

## Troubleshooting

### "Error: Could not open questions file"
- Make sure `questions.json` is in the `GoDot/` folder (same folder as `project.godot`)
- Check the file name is exactly `questions.json` (not `questions.json.txt`)
- Verify the file isn't empty or corrupted

### Questions not appearing
- Check the Godot console (bottom panel) for error messages
- Make sure the JSON file has the correct structure (see `questions.json.example`)
- Try regenerating questions from the website

### Game doesn't start
- Make sure all scripts are attached:
  - `menu.tscn` should have `menu.gd` script attached
- Check the console for any error messages
- Verify you're using Godot 4.5 or higher

### Popup doesn't show
- Check that `question_popup.tscn` exists in the `GoDot/` folder
- Verify `game_manager.gd` can find the popup scene

## Tips

- **Test with sample questions:** Use the `questions.json.example` file to test if the game works before generating your own
- **Check the console:** The Godot console shows helpful debug messages about loaded questions and game progress
- **Multiple playthroughs:** You can play the same questions multiple times - just click START again

## File Locations

Make sure your file structure looks like this:

```
GoDot/
├── questions.json          ← Your generated questions (REQUIRED)
├── menu.tscn              ← Menu scene
├── menu.gd                ← Menu script
├── game_manager.gd        ← Game logic
├── question_popup.tscn    ← Question UI
├── question_popup.gd      ← Question logic
└── project.godot         ← Project file
```

## Next Steps

Once the basic game works, you can:
- Add boss fight scenes
- Create a score display
- Add sound effects
- Style the question popup to match your game's theme
- Add level progression
- Create a results screen

