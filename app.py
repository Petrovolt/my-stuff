from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import requests
from werkzeug.utils import secure_filename
from text_extractor import extract_text_from_file
from question_generator import generate_questions_from_text
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload PDF or Word documents.'}), 400
    
    try:
        # Save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract text from the file
        print(f"Extracting text from {filename}...")
        text = extract_text_from_file(filepath)
        
        if not text or len(text.strip()) < 100:
            os.remove(filepath)
            return jsonify({'error': 'Could not extract sufficient text from the document. Please ensure the document contains readable text.'}), 400
        
        # Generate questions from the text
        print(f"Generating questions from extracted text...")
        questions_data = generate_questions_from_text(text)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'questions': questions_data,
            'total_questions': sum(len(section['questions']) for section in questions_data['sections'])
        })
    
    except ValueError as e:
        # Clean up file on error
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        error_message = str(e)
        print(f"Configuration error: {error_message}")
        return jsonify({'error': error_message}), 500
    except Exception as e:
        # Clean up file on error
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        error_message = str(e)
        print(f"Error processing file: {error_message}")
        import traceback
        traceback.print_exc()  # Print full traceback to console
        return jsonify({'error': f'Error processing file: {error_message}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=8080)

