# Damsole Tech Chatbot 🤖

An intelligent chatbot for Damsole Technologies that helps collect and manage customer leads with a modern, user-friendly interface.

## Features ✨

- Modern chat interface with real-time responses
- Collects customer information systematically
- Stores leads in MySQL database
- Sends email notifications for new leads
- Responsive design that works on all devices

## Requirements 📋

- Python 3.x
- MySQL Server
- Gmail account (for email notifications)
- Required Python packages (installed via requirements.txt)

## Setup Instructions 🚀

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DamsoleAIChatbot
   ```

2. **Set up Python Virtual Environment**
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root with the following:
   ```env
   # OpenAI API
   OPENAI_API_KEY=your_api_key_here

   # MySQL Database
   MYSQL_HOST=localhost
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DB=damsole_chatbot

   # Gmail App Credentials
   ADMIN_EMAIL=your_email@gmail.com
   ADMIN_PASSWORD=your_app_password
   ADMIN_USERNAME=Damsole Chatbot
   ```

4. **Setup MySQL Database**
   - Install MySQL Server if not already installed
   - Create a new database named `damsole_chatbot`
   - The tables will be automatically created when you run the app

## Running the Application 🌐

1. **Activate the virtual environment**
   ```bash
   # Windows
   .venv\Scripts\activate
   ```

2. **Start the Flask server**
   ```bash
   python app.py
   ```

3. **Access the chatbot**
   - Open your browser and navigate to: `http://127.0.0.1:5000`
   - The chatbot interface will be ready to collect customer information

## Project Structure 📁

```
DamsoleAIChatbot/
│
├── .env                # Environment variables
├── app.py             # Main Flask application
├── requirements.txt   # Python dependencies
│
├── static/
│   └── css/
│       └── style.css  # Chat UI styles
│
└── templates/
    └── index.html     # Chat interface template
```

## Features in Detail 🔍

1. **Lead Collection**
   - Customer Name
   - Company Name
   - Company Tagline
   - Business Category
   - Logo Color Preference
   - Contact Information
   - Address
   - Advertisement Source
   - Additional Requirements

2. **Data Management**
   - Automatic MySQL database storage
   - Email notifications for new leads
   - Structured data format

3. **User Interface**
   - Modern chat design
   - Real-time responses
   - Mobile-responsive layout
   - Smooth animations
   - User-friendly interactions

## Troubleshooting 🔧

1. **Database Connection Issues**
   - Verify MySQL is running
   - Check credentials in `.env`
   - Ensure database exists

2. **Email Notification Issues**
   - Verify Gmail app password
   - Check email credentials in `.env`
   - Ensure less secure app access is enabled

3. **UI Not Loading**
   - Clear browser cache
   - Check Flask console for errors
   - Verify static files are being served

## Security Notes 🔒

- Keep your `.env` file secure and never commit it to version control
- Use strong passwords for MySQL and email
- Regularly update dependencies
- Monitor API key usage

## Support 💡

For any issues or questions, please contact:
- Email: [Siddharthohale04@gmail.com](mailto:contact@damsoletechnologies.com)
- Website: [www.damsoletechnologies.com](https://www.damsoletechnologies.com)

---
Made with 🤝 by Damsole Technologies Employee Siddharth Ohale