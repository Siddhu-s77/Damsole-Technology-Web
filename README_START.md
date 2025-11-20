# 🚀 Damsole Technologies - Quick Start Guide

## Single Command Setup

Ab aapko sirf **ek hi command** se frontend aur chatbot dono run ho jayenge!

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd "Damsole Tech Boot Website"

# Install Python dependencies
pip install flask flask-cors python-dotenv mysql-connector-python openai
```

### Step 2: Setup Environment (Optional)

Agar aapko database aur email chahiye, to `.env` file create karein:

```env
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DB=damsole_chatbot
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD=your_app_password
OPENAI_API_KEY=your_key_here
```

### Step 3: Run Everything!

```bash
python main.py
```

**Bas itna hi!** 🎉

## What Happens?

1. ✅ Frontend website automatically serve hoga
2. ✅ Chatbot backend automatically connect hoga
3. ✅ Dono same server pe run honge (port 5000)

## Access Your Website

Browser mein open karein:
- **Home:** http://127.0.0.1:5000/
- **About:** http://127.0.0.1:5000/about.html
- **Portfolio:** http://127.0.0.1:5000/Portfolio.html
- **Contact:** http://127.0.0.1:5000/ContactUs.html

## Chatbot Testing

1. Website open karein
2. Chatbot button click karein (bottom right)
3. Message send karein
4. Response aayega! ✅

## Troubleshooting

### Chatbot not responding?
- Check console (F12) for errors
- Make sure `main.py` is running
- Visit http://127.0.0.1:5000/health to check server status

### Port already in use?
- Change port in `main.py` (last line): `port=5000` → `port=8000`
- Update `chatbot-config.js` if needed

### Database errors?
- Database optional hai - chatbot bina database ke bhi kaam karega
- Email bhi optional hai

## File Structure

```
Damsole Tech Boot Website/
├── main.py                    ← 🚀 YAHAN SE RUN KAREIN!
├── Damsole_Frentend/         ← Frontend website
│   ├── index.html
│   ├── about.html
│   └── assets/
└── Damsole Tech Chat Bot/     ← Chatbot backend
    └── DamsoleAIChatbot/
        └── app.py
```

## That's It!

Ab bas `python main.py` run karein aur sab kuch automatically kaam karega! 🎊

