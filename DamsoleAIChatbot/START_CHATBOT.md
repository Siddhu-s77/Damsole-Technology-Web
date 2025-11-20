# 🤖 Chatbot Server Start Guide

## Quick Start

1. **Navigate to chatbot folder:**
   ```bash
   cd "Damsole Tech Chat Bot/DamsoleAIChatbot"
   ```

2. **Activate virtual environment (if using):**
   ```bash
   # Windows
   .venv\Scripts\activate
   
   # Or create new venv
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file** (if not exists) with your credentials:
   ```env
   OPENAI_API_KEY=your_key_here
   MYSQL_HOST=localhost
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DB=damsole_chatbot
   ADMIN_EMAIL=your_email@gmail.com
   ADMIN_PASSWORD=your_app_password
   CHATBOT_ALLOWED_ORIGINS=*
   ```

5. **Start Flask server:**
   ```bash
   python app.py
   ```

6. **Server will run on:** `http://127.0.0.1:5000`

7. **Open your website** in browser - chatbot will connect automatically!

## Troubleshooting

- **Chatbot not responding?** 
  - Check Flask server is running (you should see "Running on http://127.0.0.1:5000")
  - Open browser console (F12) and check for errors
  - Verify endpoint in `chatbot-config.js` matches Flask server URL

- **CORS errors?**
  - Make sure `CHATBOT_ALLOWED_ORIGINS=*` in .env file
  - Or set specific origin like `CHATBOT_ALLOWED_ORIGINS=http://localhost:3000,file://`

- **Database errors?**
  - Make sure MySQL is running
  - Check .env credentials are correct
  - Database will be created automatically on first run

## Testing

Open browser console and you should see:
- `🤖 Chatbot config loaded: {endpoint: "http://127.0.0.1:5000/chat", ...}`
- When you send a message: `📤 Sending message to: http://127.0.0.1:5000/chat`
- Response: `📥 Response status: 200 OK`
- `✅ Response data: {reply: "..."}`

