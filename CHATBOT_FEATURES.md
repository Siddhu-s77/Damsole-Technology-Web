# 🤖 Damsole Technologies - Professional Business Chatbot

## ✨ Features

### 1. **AI Mode** (Default)
- Answers questions about Damsole Technologies
- Answers general web development questions (pricing, services, design, hosting, domain)
- Uses OpenAI GPT-3.5-turbo for intelligent responses
- Friendly and conversational tone
- Maintains conversation context

### 2. **Lead Collection Mode** (10-Step Form)
- Step-by-step questionnaire
- Data validation for each field
- Next question appears ONLY after valid answer
- Invalid answers show: "❌ Wrong answer. Please enter a valid response."

### 3. **Data Validation**

#### Name Validation:
- Minimum 2 letters
- Only alphabets and spaces allowed
- Error: "Name must be at least 2 letters long."

#### Email Validation:
- Valid email format required
- Error: "Please enter a valid email address."

#### Phone Validation:
- Minimum 10 digits required
- Only digits allowed (spaces/dashes auto-removed)
- Error: "Phone number must be at least 10 digits."

#### Other Fields:
- Cannot be empty
- Error: "[Field Name] cannot be empty."

### 4. **Data Storage**
- Saves all leads to MySQL database
- Table: `leads` with all client details
- Timestamp automatically added

### 5. **Email Notification**
- Sends formatted email to **admin only** (ADMIN_EMAIL)
- **NO email sent to client**
- Email includes all client details in formatted layout
- Subject: "📩 New Chatbot Lead - Damsole Technologies"

## 🔄 Mode Switching

### Start Lead Collection:
User can trigger lead collection by saying:
- "I want to fill the form"
- "collect my details"
- "form"
- "lead"
- "sign up"
- "register"
- "get started"
- "contact form"
- etc.

### AI Mode Suggestions:
After 4+ messages in AI mode, chatbot suggests:
"💡 Would you like to share your details with us? Just say 'I want to fill the form' or 'collect my details'."

## 📋 Lead Collection Questions (10 Steps)

1. **Name** - "👋 Hello! Welcome to Damsole Technologies. What is your *Name*?"
2. **Company Name** - "Great! What is your *Company Name*?"
3. **Company Tagline** - "Nice! What is your *Company Tagline*?"
4. **Business Category** - "What is your *Business Category*?"
5. **Logo Color** - "What is your preferred *Logo Color*?"
6. **Email ID** - "Can you share your *Email ID*?"
7. **Contact Number** - "Please provide your *Contact Number*."
8. **Address** - "Your *Address* please?"
9. **Ad Source** - "Where did you see our Ad? (FB / Google / Other)"
10. **Suggestions** - "Any *Suggestions or Requirements* you'd like to share?"

## 🚀 Usage

### Start Server:
```bash
python main.py
```

### Access:
- Frontend: http://127.0.0.1:5000/
- Chatbot API: http://127.0.0.1:5000/chat
- Health Check: http://127.0.0.1:5000/health

## ⚙️ Configuration (.env)

```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# MySQL Database
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DB=damsole_chatbot

# Email (Gmail)
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD=your_app_password

# CORS (optional)
CHATBOT_ALLOWED_ORIGINS=*
```

## 📊 Database Schema

```sql
CREATE TABLE leads (
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
);
```

## 🎯 Conversation Flow Examples

### AI Mode:
```
User: "What services does Damsole offer?"
Bot: [AI Response about services]

User: "What's your pricing?"
Bot: [AI Response about pricing]

User: "I want to fill the form"
Bot: "Great! Let's collect your details. 👋 Hello! Welcome to Damsole Technologies. What is your *Name*?"
```

### Lead Collection Mode:
```
Bot: "👋 Hello! Welcome to Damsole Technologies. What is your *Name*?"
User: "J"
Bot: "❌ Wrong answer. Please enter a valid response. Name must be at least 2 letters long. 👋 Hello! Welcome to Damsole Technologies. What is your *Name*?"

User: "John"
Bot: "Great! What is your *Company Name*?"
User: "ABC Corp"
Bot: "Nice! What is your *Company Tagline*?"
...
[Continues through all 10 questions]
```

## ✅ Success Message

After completing all questions:
```
✅ Thank you! Your details have been saved to our database and our team will contact you soon.

We appreciate your interest in Damsole Technologies!
```

## 🔒 Security Notes

- Email sent ONLY to admin (ADMIN_EMAIL)
- NO email sent to client
- All data validated before storage
- CORS configured for security
- Environment variables for sensitive data

