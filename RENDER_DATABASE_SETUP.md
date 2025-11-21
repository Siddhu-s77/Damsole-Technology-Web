# 🗄️ Render Database Setup Guide

## Quick Setup for Render PostgreSQL

### Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard** → Click **"New +"** → **"PostgreSQL"**

2. **Configure Database:**
   - **Name:** `damsole-db` (or any name you prefer)
   - **Database:** `damsole_chatbot` (or any name)
   - **User:** Auto-generated (or custom)
   - **Region:** Same as your web service (e.g., `Oregon (US West)`)
   - **Plan:** `Free` (or paid for production)

3. **Click "Create Database"**

4. **Wait for database to be ready** (takes 1-2 minutes)

---

### Step 2: Get Database Connection Details

1. **Go to your database** → Click on **"Connections"** tab

2. **Copy these values:**
   - **Internal Database URL** (or individual values):
     ```
     postgresql://user:password@host:5432/database_name
     ```
   
   **OR copy individual values:**
   - **Host:** (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
   - **Port:** `5432`
   - **Database:** (e.g., `damsole_chatbot`)
   - **User:** (e.g., `damsole_user`)
   - **Password:** (shown once, copy it!)

---

### Step 3: Add Environment Variables to Web Service

1. **Go to your Web Service** → **Environment** tab

2. **Add these environment variables:**

   ```
   DB_TYPE=postgres
   POSTGRES_HOST=your-postgres-host.render.com
   POSTGRES_USER=your-postgres-user
   POSTGRES_PASSWORD=your-postgres-password
   POSTGRES_DB=damsole_chatbot
   ```

   **OR use single DATABASE_URL:**
   ```
   DB_TYPE=postgres
   DATABASE_URL=postgresql://user:password@host:5432/database_name
   ```

3. **Click "Save Changes"** (this will trigger a redeploy)

---

### Step 4: Verify Database Connection

1. **Check Logs** after redeploy:
   - Should see: `✅ POSTGRES database initialized successfully!`
   - If error: Check environment variables are correct

2. **Test Chatbot:**
   - Fill out lead form in chatbot
   - Check logs for: `✅ Data saved to database successfully!`

---

## Local Development (MySQL)

### For Local Development, use MySQL:

1. **Install MySQL** (if not installed):
   - Windows: Download from mysql.com
   - Mac: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Create Database:**
   ```sql
   CREATE DATABASE damsole_chatbot;
   ```

3. **Create `.env` file** in `DamsoleAIChatbot/` folder:
   ```
   DB_TYPE=mysql
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DB=damsole_chatbot
   ```

4. **Run locally:**
   ```bash
   python main.py
   ```

---

## Environment Variables Summary

### For Render (PostgreSQL):
```
DB_TYPE=postgres
POSTGRES_HOST=your-host.render.com
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password
POSTGRES_DB=damsole_chatbot
```

### For Local (MySQL):
```
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=damsole_chatbot
```

---

## Troubleshooting

### ❌ "Database not configured"
- **Check:** All environment variables are set
- **Check:** No typos in variable names
- **Check:** Database service is running (on Render)

### ❌ "Could not connect to database"
- **Check:** Host, user, password, database name are correct
- **Check:** Database is accessible (not paused)
- **Check:** Network connectivity

### ❌ "psycopg2 not found"
- **Solution:** Already added to `requirements.txt`
- **Check:** Render redeployed after adding psycopg2-binary

---

## Notes

- ✅ **Local:** Uses MySQL (localhost)
- ✅ **Render:** Uses PostgreSQL (auto-detected)
- ✅ **Both work:** Code automatically detects database type
- ✅ **No database:** App still works, only email notifications sent

---

## Quick Test

After setup, test by:
1. Opening chatbot on website
2. Saying "I want to create website"
3. Filling out the form
4. Check logs: Should see "✅ Data saved to database successfully!"

---

**Done! 🎉 Your database is now configured for both Render and local development!**

