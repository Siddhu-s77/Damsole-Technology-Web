from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os, smtplib, datetime, mysql.connector
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import openai

# Load environment
load_dotenv()

app = Flask(__name__)

# --- Config ---
openai.api_key = os.getenv("OPENAI_API_KEY")

DB_SETTINGS = {
    "host": os.getenv("MYSQL_HOST"),
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD"),
    "database": os.getenv("MYSQL_DB")
}

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

# --- Database Setup ---
def init_db():
    conn = mysql.connector.connect(**DB_SETTINGS)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(255),
            company_name VARCHAR(255),
            company_tagline TEXT,
            business_category VARCHAR(255),
            logo_color VARCHAR(100),
            mail_id VARCHAR(255),
            contact_number VARCHAR(20),
            address TEXT,
            ad_source VARCHAR(100),
            suggestion TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()

# --- Email Function ---
def send_email(data):
    subject = "📩 New Chatbot Lead - Damsole Technologies"
    body = "\n".join([f"{k}: {v}" for k, v in data.items()])

    msg = MIMEMultipart()
    msg["From"], msg["To"], msg["Subject"] = ADMIN_EMAIL, ADMIN_EMAIL, subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as s:
        s.starttls()
        s.login(ADMIN_EMAIL, ADMIN_PASSWORD)
        s.send_message(msg)

# --- Save to DB ---
def save_to_db(data):
    conn = mysql.connector.connect(**DB_SETTINGS)
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO leads (customer_name, company_name, company_tagline, business_category, logo_color,
                           mail_id, contact_number, address, ad_source, suggestion)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data.get("Customer Name"), data.get("Company Name"), data.get("Company Tagline"),
        data.get("Business Category"), data.get("Logo Color"), data.get("Mail ID"),
        data.get("Contact Number"), data.get("Address"), data.get("Ad Source"),
        data.get("Suggestion")
    ))
    conn.commit()
    cur.close()
    conn.close()

# --- Chat Logic ---
questions = [
    "👋 Hello! Welcome to Damsole Technologies. What is your *Name*?",
    "Great! What is your *Company Name*?",
    "Nice! What is your *Company Tagline*?",
    "What is your *Business Category*?",
    "What is your preferred *Logo Color*?",
    "Can you share your *Email ID*?",
    "Please provide your *Contact Number*.",
    "Your *Address* please?",
    "Where did you see our Ad? (FB / Google / Other)",
    "Any *Suggestions or Requirements* you’d like to share?"
]

user_sessions = {}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]
    user_id = "single_user"  # (you can extend later for multiple users)
    
    if user_id not in user_sessions:
        user_sessions[user_id] = {"step": 0, "data": {}}
    
    session = user_sessions[user_id]
    step = session["step"]

    # Store answer of previous question
    if step > 0:
        current_key = list(questions_map.keys())[step - 1]
        session["data"][questions_map[current_key]] = user_message

    # If finished asking all questions
    if step == len(questions):
        data = session["data"]
        save_to_db(data)
        send_email(data)
        reply = "✅ Thank you! Your details have been saved and emailed to Damsole Technologies."
        user_sessions.pop(user_id)
        return jsonify({"reply": reply})

    # Ask next question
    next_question = questions[step]
    session["step"] += 1
    return jsonify({"reply": next_question})

questions_map = {
    questions[0]: "Customer Name",
    questions[1]: "Company Name",
    questions[2]: "Company Tagline",
    questions[3]: "Business Category",
    questions[4]: "Logo Color",
    questions[5]: "Mail ID",
    questions[6]: "Contact Number",
    questions[7]: "Address",
    questions[8]: "Ad Source",
    questions[9]: "Suggestion"
}

if __name__ == "__main__":
    app.run(debug=True)
