"""
🚀 Damsole Technologies - Unified Server
This file runs both the Frontend Website and Chatbot Backend together.
Just run: python main.py
"""

from flask import Flask, send_from_directory, send_file, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Add chatbot directory to path
chatbot_path = os.path.join(os.path.dirname(__file__), 'DamsoleAIChatbot')
if os.path.exists(chatbot_path):
    sys.path.insert(0, chatbot_path)
else:
    # Fallback to nested path
    nested_path = os.path.join(os.path.dirname(__file__), 'Damsole Tech Chat Bot', 'DamsoleAIChatbot')
    if os.path.exists(nested_path):
        sys.path.insert(0, nested_path)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, 
            static_folder='Damsole_Frentend',
            template_folder='Damsole_Frentend')

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Import chatbot functions from app.py
try:
    from app import (
        init_db, send_email, save_to_db, 
        user_sessions,
        get_support_response, wants_to_create_project, get_next_question,
        validate_name, validate_email, validate_phone, validate_address, validate_project, validate_deadline
    )
    CHATBOT_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Warning: Could not import chatbot functions: {e}")
    CHATBOT_AVAILABLE = False

# ========== FRONTEND ROUTES ==========

@app.route('/')
def index():
    """Serve main index page"""
    return send_file('Damsole_Frentend/index.html')

@app.route('/index.html')
def index_html():
    """Serve index.html"""
    return send_file('Damsole_Frentend/index.html')

@app.route('/about.html')
def about():
    """Serve about page"""
    return send_file('Damsole_Frentend/about.html')

@app.route('/Portfolio.html')
def portfolio():
    """Serve portfolio page"""
    return send_file('Damsole_Frentend/Portfolio.html')

@app.route('/ContactUs.html')
def contact():
    """Serve contact page"""
    return send_file('Damsole_Frentend/ContactUs.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, images)"""
    return send_from_directory('Damsole_Frentend', filename)
 
# ========== CHATBOT ROUTES ==========

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "message": "Damsole Technologies Server is running",
        "frontend": "Available",
        "chatbot": "Available" if CHATBOT_AVAILABLE else "Not Available",
        "endpoints": {
            "chat": "/chat",
            "health": "/health"
        }
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Chatbot endpoint - handles all chatbot conversations"""
    if not CHATBOT_AVAILABLE:
        return jsonify({
            "reply": "Sorry, chatbot service is not available. Please check server configuration."
        }), 503
    
    try:
        payload = request.get_json(silent=True) or {}
        user_message = (payload.get("message") or "").strip()

        user_id = "single_user"
        
        # Initialize session if not exists
        if user_id not in user_sessions:
            user_sessions[user_id] = {
                "mode": "support",  # "support" or "collecting"
                "data": {},
                "conversation_history": [],
                "current_field": None
            }
        
        session = user_sessions[user_id]
        mode = session["mode"]
        data = session.get("data", {})

        # Handle auto-start payload
        if user_message == "__damsole_auto_start__":
            session["mode"] = "support"
            session["data"] = {}
            session["current_field"] = None
            return jsonify({"reply": ""})

        # If no message provided
        if not user_message:
            return jsonify({"reply": "I didn't catch that. Could you please repeat?"}), 400

        # SUPPORT MODE: Answer general questions
        if mode == "support":
            # Check if user wants to create something
            if wants_to_create_project(user_message):
                # Switch to collection mode
                session["mode"] = "collecting"
                session["data"] = {}
                session["current_field"] = None
                
                # Start with first question
                first_question = get_next_question(session)
                return jsonify({"reply": f"Perfect! I'd be happy to help you with that. Let me collect a few details from you.\n\n{first_question}"})
            
            # Otherwise, answer as support agent
            session["conversation_history"].append({"role": "user", "content": user_message})
            
            support_response = get_support_response(user_message, session["conversation_history"])
            
            session["conversation_history"].append({"role": "assistant", "content": support_response})
            
            return jsonify({"reply": support_response})

        # COLLECTING MODE: Collect required details one by one
        if mode == "collecting":
            current_field = session.get("current_field")
            
            # Determine which field we're collecting
            if not current_field:
                # Find first missing field
                if "Full Name" not in data:
                    current_field = "Full Name"
                    session["current_field"] = current_field
                elif "Email" not in data:
                    current_field = "Email"
                    session["current_field"] = current_field
                elif "Phone Number" not in data:
                    current_field = "Phone Number"
                    session["current_field"] = current_field
                elif "Address" not in data:
                    current_field = "Address"
                    session["current_field"] = current_field
                elif "Project Requirement" not in data:
                    current_field = "Project Requirement"
                    session["current_field"] = current_field
                elif "Deadline" not in data:
                    current_field = "Deadline"
                    session["current_field"] = current_field
                else:
                    # All fields collected!
                    # Save to database and send email
                    db_saved = save_to_db(data)
                    email_sent = send_email(data)
                    
                    success_msg = "Thank you! I have all the required details. Our Damsole team will contact you shortly."
                    
                    # Switch back to support mode
                    session["mode"] = "support"
                    session["data"] = {}
                    session["current_field"] = None
                    
                    return jsonify({"reply": success_msg})
            
            # Validate the current field
            is_valid = True
            error_msg = None
            
            if current_field == "Full Name":
                is_valid, error_msg = validate_name(user_message)
            elif current_field == "Email":
                is_valid, error_msg = validate_email(user_message)
            elif current_field == "Phone Number":
                is_valid, error_msg = validate_phone(user_message)
            elif current_field == "Address":
                is_valid, error_msg = validate_address(user_message)
            elif current_field == "Project Requirement":
                is_valid, error_msg = validate_project(user_message)
            elif current_field == "Deadline":
                is_valid, error_msg = validate_deadline(user_message)
            
            if not is_valid:
                # Invalid answer, ask again politely
                question = get_next_question(session)
                return jsonify({"reply": f"I'm sorry, but that doesn't seem right. {error_msg}\n\n{question}"})
            
            # Valid answer - store it
            data[current_field] = user_message.strip()
            session["data"] = data
            session["current_field"] = None
            
            # Get next question
            next_question = get_next_question(session)
            if next_question:
                return jsonify({"reply": next_question})
            else:
                # All fields collected!
                db_saved = save_to_db(data)
                email_sent = send_email(data)
                
                success_msg = "Thank you! I have all the required details. Our Damsole team will contact you shortly."
                
                # Switch back to support mode
                session["mode"] = "support"
                session["data"] = {}
                session["current_field"] = None
                
                return jsonify({"reply": success_msg})

    except Exception as e:
        print(f"❌ Chat error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"reply": "I apologize, but I encountered an error. Could you please try again?"}), 500

# ========== INITIALIZATION ==========

def initialize_server():
    """Initialize database and print startup info"""
    if CHATBOT_AVAILABLE:
        try:
            init_db()
        except Exception as e:
            print(f"⚠️ Database initialization warning: {e}")
    
    print("\n" + "="*70)
    print("🚀 Damsole Technologies - Unified Server")
    print("="*70)
    print("📍 Frontend Website: http://127.0.0.1:5000")
    print("📍 Chatbot API: http://127.0.0.1:5000/chat")
    print("📍 Health Check: http://127.0.0.1:5000/health")
    print("="*70)
    print("📄 Available Pages:")
    print("   • http://127.0.0.1:5000/ (Home)")
    print("   • http://127.0.0.1:5000/about.html")
    print("   • http://127.0.0.1:5000/Portfolio.html")
    print("   • http://127.0.0.1:5000/ContactUs.html")
    print("="*70)
    if CHATBOT_AVAILABLE:
        print("✅ Chatbot: Ready")
    else:
        print("⚠️ Chatbot: Not Available (check app.py import)")
    print("✅ Frontend: Ready")
    print("="*70)
    print("🎉 Server is running! Open http://127.0.0.1:5000 in your browser")
    print("="*70 + "\n")

# ========== MAIN ==========

if __name__ == "__main__":
    initialize_server()
    # Production: Use PORT from environment (Render sets this automatically)
    # Development: Default to 5000
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_ENV") == "development"
    app.run(debug=debug_mode, host='0.0.0.0', port=port, threaded=True)

