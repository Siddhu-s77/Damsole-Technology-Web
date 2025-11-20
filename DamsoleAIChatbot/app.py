"""
🤖 Damsole Technologies - Professional Support Team Chatbot
Behaves like a real human support executive
Collects: Name, Email, Phone, Address, Project Requirement, Deadline
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os, smtplib, datetime, mysql.connector, re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import openai

# Load environment
load_dotenv()

app = Flask(__name__)

allowed_origins = os.getenv("CHATBOT_ALLOWED_ORIGINS", "*")
if allowed_origins.strip() == "*":
    cors_origins = "*"
else:
    cors_origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]

CORS(app, resources={r"/chat": {"origins": cors_origins}}, supports_credentials=True)

# --- Config ---
def _env_str(key: str, default: str = "") -> str:
    value = os.getenv(key)
    return value if value is not None else default

openai.api_key = _env_str("OPENAI_API_KEY")

DB_SETTINGS = {
    "host": _env_str("MYSQL_HOST"),
    "user": _env_str("MYSQL_USER"),
    "password": _env_str("MYSQL_PASSWORD"),
    "database": _env_str("MYSQL_DB")
}

ADMIN_EMAIL = _env_str("ADMIN_EMAIL")
ADMIN_PASSWORD = _env_str("ADMIN_PASSWORD")

# --- Database Setup ---
def init_db():
    try:
        conn = mysql.connector.connect(**DB_SETTINGS)
        cur = conn.cursor()
        
        # Check if table exists
        cur.execute("SHOW TABLES LIKE 'leads'")
        table_exists = cur.fetchone()
        
        if table_exists:
            # Table exists - check if it has old schema
            cur.execute("DESCRIBE leads")
            columns = [col[0] for col in cur.fetchall()]
            
            # If old schema exists (has customer_name), migrate to new schema
            if 'customer_name' in columns and 'full_name' not in columns:
                print("🔄 Migrating database schema from old to new format...")
                try:
                    # Drop old table and create new one
                    cur.execute("DROP TABLE IF EXISTS leads")
                    conn.commit()
                    print("✅ Old table dropped")
                except Exception as e:
                    print(f"⚠️ Error dropping old table: {e}")
        
        # Create table with new schema
        cur.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255),
                email VARCHAR(255),
                phone_number VARCHAR(20),
                address TEXT,
                project_requirement TEXT,
                deadline VARCHAR(255),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        print("⚠️ Make sure MySQL is running and credentials in .env are correct.")

init_db()

# --- Email Function ---
def send_email(data):
    """Send email with client details ONLY to admin email"""
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        print("⚠️ Email credentials not configured. Skipping email send.")
        return False
    
    try:
        subject = "📩 New Lead - Damsole Technologies Support Chatbot"
        
        body = f"""
New Lead Received from Damsole Technologies Support Chatbot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT DETAILS:

👤 Full Name: {data.get("Full Name", "N/A")}
📧 Email: {data.get("Email", "N/A")}
📱 Phone Number: {data.get("Phone Number", "N/A")}
📍 Address: {data.get("Address", "N/A")}
💼 Project Requirement: {data.get("Project Requirement", "N/A")}
📅 Deadline: {data.get("Deadline", "N/A")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Timestamp: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

This is an automated email from Damsole Technologies Support Chatbot.
        """.strip()

        msg = MIMEMultipart()
        msg["From"] = ADMIN_EMAIL
        msg["To"] = ADMIN_EMAIL
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP("smtp.gmail.com", 587) as s:
            s.starttls()
            s.login(ADMIN_EMAIL, ADMIN_PASSWORD)
            s.send_message(msg)
        print("✅ Email sent successfully to admin!")
        return True
    except Exception as e:
        print(f"❌ Email send failed: {e}")
        return False

# --- Save to DB ---
def save_to_db(data):
    try:
        conn = mysql.connector.connect(**DB_SETTINGS)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO leads (full_name, email, phone_number, address, project_requirement, deadline)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data.get("Full Name", ""),
            data.get("Email", ""),
            data.get("Phone Number", ""),
            data.get("Address", ""),
            data.get("Project Requirement", ""),
            data.get("Deadline", "")
        ))
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Data saved to database successfully!")
        return True
    except Exception as e:
        print(f"❌ Database save failed: {e}")
        return False

# --- Validation Functions ---
def validate_name(name):
    """Validate name: minimum 2 letters"""
    if not name or len(name.strip()) < 2:
        return False, "Please provide your full name (at least 2 letters)."
    if not re.match(r'^[a-zA-Z\s\.]+$', name.strip()):
        return False, "Name should only contain letters, spaces, and dots."
    return True, None

def validate_email(email):
    """Validate email format"""
    if not email or not email.strip():
        return False, "Please provide a valid email address."
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email.strip()):
        return False, "Please enter a valid email address (e.g., name@example.com)."
    return True, None

def validate_phone(phone):
    """Validate phone: minimum 10 digits"""
    if not phone or not phone.strip():
        return False, "Please provide your phone number."
    digits_only = re.sub(r'[\s\-\(\)\+]', '', phone)
    if not digits_only.isdigit():
        return False, "Phone number should only contain digits."
    if len(digits_only) < 10:
        return False, "Phone number must be at least 10 digits."
    return True, None

def validate_address(address):
    """Validate address: minimum 5 characters"""
    if not address or len(address.strip()) < 5:
        return False, "Please provide a complete address (at least 5 characters)."
    return True, None

def validate_project(project):
    """Validate project requirement: must be clear"""
    if not project or len(project.strip()) < 3:
        return False, "Please tell us what you want to build (e.g., website, app, logo, software)."
    return True, None

def validate_deadline(deadline):
    """Validate deadline: any format allowed"""
    if not deadline or len(deadline.strip()) < 2:
        return False, "Please provide a deadline (e.g., 5 days, next month, 20th March)."
    return True, None

# --- Required Fields for Collection ---
REQUIRED_FIELDS = [
    "Full Name",
    "Email",
    "Phone Number",
    "Address",
    "Project Requirement",
    "Deadline"
]

# --- Hard-coded Knowledge Base ---
KNOWLEDGE_BASE = {
    "about": "Damsole Technologies is a leading digital agency specializing in web development, design, and digital marketing. We offer comprehensive digital solutions including Web Development, UI/UX Design, Digital Marketing, Software Development, Chatbot Development, Brand Logo Design, Product Design, Business Strategy, and Research services. We focus on ROI-driven solutions with an expert team and proven track record. Contact us at sales@damsole.com or call 91+9356917424.",
    
    "services": "We offer a wide range of services:\n\n• Web Development - Custom websites and web applications\n• UI/UX Design - Beautiful and user-friendly designs\n• Digital Marketing - SEO, social media, and online advertising\n• Software Development - Custom software solutions\n• Chatbot Development - AI-powered chatbots\n• Brand Logo Design - Professional logo and branding\n• Product Design - Innovative product designs\n• Business Strategy - Strategic planning and consulting\n• Research - Market research and data analysis",
    
    "pricing": "Our pricing depends on your specific requirements. We offer:\n\n• Basic Website: Starting from affordable packages\n• E-commerce Website: Custom pricing based on features\n• Custom Web Applications: Tailored to your needs\n• Ongoing Maintenance: Flexible plans available\n\nFor detailed pricing, please share your project requirements and we'll provide a custom quote!",
    
    "contact": "You can reach us at:\n📧 Email: sales@damsole.com\n📱 Phone: 91+9356917424\n📍 Office: Office No. 103, 104, Madhuban Complex, 1st Floor, Near Maxcare Hospital, Manchar 410503\n\nWe're available Monday to Saturday, 9:30 AM to 6:30 PM.",
    
    "website": "We create professional, responsive websites tailored to your business needs. Our websites are mobile-friendly, SEO optimized, fast loading, and secure. We can build everything from simple business websites to complex e-commerce platforms. Would you like to share your requirements?",
    
    "design": "We create beautiful, modern website designs that are visually appealing, mobile-responsive, and convert visitors into customers. Our design process includes understanding your brand, creating mockups, getting your feedback, and final implementation.",
    
    "hosting": "We provide website hosting services with fast and reliable servers, 99.9% uptime guarantee, SSL certificates, regular backups, and 24/7 technical support. We can help you choose the right hosting plan for your website.",
    
    "domain": "We can help you with domain name registration, domain transfer, domain renewal, DNS management, and email setup with your domain. We make it easy to get your domain and get your website online quickly!",
    
    "time": "Project timelines depend on complexity:\n\n• Simple Website: 1-2 weeks\n• E-commerce Site: 3-6 weeks\n• Custom Application: 4-12 weeks\n• Logo/Branding: 1-2 weeks\n\nWe always discuss timelines upfront and can work on urgent projects if needed!",
}

def get_hardcoded_response(user_message):
    """Check hard-coded knowledge base for answers"""
    message_lower = user_message.lower().strip()
    
    if "about damsole" in message_lower or "about damsole tech" in message_lower or "tell me about damsole" in message_lower:
        return KNOWLEDGE_BASE["about"]
    if "services" in message_lower or "what services" in message_lower or "what do you offer" in message_lower:
        return KNOWLEDGE_BASE["services"]
    if "pricing" in message_lower or "price" in message_lower or "cost" in message_lower or "how much" in message_lower:
        return KNOWLEDGE_BASE["pricing"]
    if "contact" in message_lower or "phone" in message_lower or "email" in message_lower or "reach" in message_lower:
        return KNOWLEDGE_BASE["contact"]
    if "website" in message_lower and ("develop" in message_lower or "create" in message_lower or "build" in message_lower):
        return KNOWLEDGE_BASE["website"]
    if "design" in message_lower and ("website" in message_lower or "web" in message_lower):
        return KNOWLEDGE_BASE["design"]
    if "hosting" in message_lower or "host" in message_lower:
        return KNOWLEDGE_BASE["hosting"]
    if "domain" in message_lower:
        return KNOWLEDGE_BASE["domain"]
    if "time" in message_lower and ("take" in message_lower or "long" in message_lower or "duration" in message_lower):
        return KNOWLEDGE_BASE["time"]
    
    return None

# --- AI Response for Support Questions ---
def get_support_response(user_message, conversation_history=None):
    """Get AI response as a support team agent"""
    
    # First check hard-coded responses
    hardcoded = get_hardcoded_response(user_message)
    if hardcoded:
        return hardcoded
    
    system_prompt = """You are a friendly, intelligent, and highly professional Support Team Agent of Damsole Technologies.

Your communication tone:
- Warm and human-like
- Professional and polite
- Easy to understand
- Conversational, just like a real support executive
- Helpful and customer-focused

About Damsole Technologies:
- Services: Web Development, UI/UX Design, Digital Marketing, Software Development, Chatbot Development, Brand Logo Design, Product Design, Business Strategy, Research
- Contact: sales@damsole.com, Phone: 91+9356917424
- Office: Office No. 103, 104, Madhuban Complex, 1st Floor, Near Maxcare Hospital, Manchar 410503
- Available: Monday to Saturday, 9:30 AM to 6:30 PM

Always reply in a simple, friendly, and professional tone. Behave like a real human support team member, not an AI."""

    try:
        messages = [{"role": "system", "content": system_prompt}]
        
        if conversation_history:
            messages.extend(conversation_history[-4:])
        
        messages.append({"role": "user", "content": user_message})
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai.api_key)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=250
            )
            return response.choices[0].message.content.strip()
        except (ImportError, AttributeError):
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=250
            )
            return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"❌ AI API error: {e}")
        # Fallback to helpful message when OpenAI is unavailable
        return "I'd be happy to help! You can ask me about:\n\n• Our services (web development, design, marketing, etc.)\n• Pricing information\n• Project timelines\n• How to get started with your project\n\nOr just tell me what you'd like to build, and I'll collect your details!"

# --- Intent Detection: Does user want to create something? ---
def wants_to_create_project(message):
    """Detect if user wants to create/build something"""
    message_lower = message.lower()
    
    # Keywords indicating project creation intent
    create_keywords = [
        "website banana", "website banani", "website chahiye", "website banwana",
        "app banana", "app banani", "app chahiye", "app banwana",
        "logo banana", "logo banani", "logo chahiye",
        "software banana", "software banani", "software chahiye",
        "i want to make", "i want to create", "i want to build",
        "i need website", "i need app", "i need logo", "i need software",
        "website create", "app create", "logo create",
        "make website", "create website", "build website",
        "make app", "create app", "build app",
        "project chahiye", "project banana",
        "details de deta", "details de deti", "details de sakta", "details de sakti",
        "haan details", "yes details", "ok details",
        "form fill", "fill form", "form bhar"
    ]
    
    return any(keyword in message_lower for keyword in create_keywords)

# --- User Sessions ---
user_sessions = {}

def get_next_question(session):
    """Get the next question to ask based on what's missing"""
    data = session.get("data", {})
    current_field = session.get("current_field")
    
    # Set current_field if not set
    if not current_field:
        if "Full Name" not in data:
            session["current_field"] = "Full Name"
            return "Great! To get started, may I know your full name, please?"
        elif "Email" not in data:
            session["current_field"] = "Email"
            return "Thank you! Could you please share your email address?"
        elif "Phone Number" not in data:
            session["current_field"] = "Phone Number"
            return "Perfect! What's your phone number?"
        elif "Address" not in data:
            session["current_field"] = "Address"
            return "Got it! Could you please provide your address?"
        elif "Project Requirement" not in data:
            session["current_field"] = "Project Requirement"
            return "Excellent! What would you like us to build for you? (e.g., website, mobile app, logo, software, etc.)"
        elif "Deadline" not in data:
            session["current_field"] = "Deadline"
            return "Understood! By when would you like this project to be completed? (e.g., 5 days, next month, 20th March)"
        else:
            return None  # All fields collected
    else:
        # Return question for current field
        if current_field == "Full Name":
            return "Great! To get started, may I know your full name, please?"
        elif current_field == "Email":
            return "Thank you! Could you please share your email address?"
        elif current_field == "Phone Number":
            return "Perfect! What's your phone number?"
        elif current_field == "Address":
            return "Got it! Could you please provide your address?"
        elif current_field == "Project Requirement":
            return "Excellent! What would you like us to build for you? (e.g., website, mobile app, logo, software, etc.)"
        elif current_field == "Deadline":
            return "Understood! By when would you like this project to be completed? (e.g., 5 days, next month, 20th March)"
        else:
            return None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "message": "Damsole Support Chatbot is running",
        "endpoint": "/chat"
    })

@app.route("/chat", methods=["POST"])
def chat():
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

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🤖 Damsole Technologies - Support Team Chatbot")
    print("="*70)
    print("📍 Server URL: http://127.0.0.1:5000")
    print("📍 Chat Endpoint: http://127.0.0.1:5000/chat")
    print("📍 Health Check: http://127.0.0.1:5000/health")
    print("="*70)
    print("✨ Features:")
    print("   • Human-like support agent behavior")
    print("   • Natural conversation flow")
    print("   • Collects 6 required details")
    print("   • Validates each field before proceeding")
    print("   • Answers general questions")
    print("   • MySQL database storage")
    print("   • Email notification to admin")
    print("="*70)
    print("✅ Server is ready! Open your website to use the chatbot.")
    print("="*70 + "\n")
    app.run(debug=True, host='127.0.0.1', port=5000)
