# 🚀 Render Deployment Guide - Damsole Technologies

## Complete Step-by-Step Deployment Instructions

### Prerequisites
- ✅ GitHub account
- ✅ Render account (sign up at https://render.com)
- ✅ OpenAI API key (optional, for chatbot AI features)
- ✅ MySQL/PostgreSQL database (optional, for lead storage)
- ✅ Gmail app password (optional, for email notifications)

---

## Step 1: Prepare Your Code

### ✅ Files Already Created:
- `requirements.txt` - Python dependencies
- `render.yaml` - Render configuration
- `main.py` - Updated for production (uses PORT from environment)

### 📝 Verify These Files Exist:
```
Damsole Tech Boot Website/
├── requirements.txt          ← ✅ Created
├── render.yaml               ← ✅ Created
├── main.py                   ← ✅ Updated
├── .gitignore                ← ✅ Already exists
└── Damsole_Frentend/         ← Frontend files
```

---

## Step 2: Push to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 3: Create Render Account & Connect GitHub

1. Go to https://render.com
2. Sign up / Login (use GitHub to connect)
3. Authorize Render to access your GitHub repositories

---

## Step 4: Create Web Service on Render

### Option A: Using Dashboard (Recommended)

1. **Click "New +" → "Web Service"**
2. **Connect Repository:**
   - Select your GitHub repository: `Damsole-Technology-Web`
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `damsole-tech-website`
   - **Environment:** `Python 3`
   - **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch:** `main`

4. **Build & Deploy Settings:**
   - **Build Command:**
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     gunicorn main:app --bind 0.0.0.0:$PORT
     ```
   - **Instance Type:** `Free` (or choose paid plan)

5. **Click "Create Web Service"**

### Option B: Using render.yaml (Auto-deploy)

If you pushed `render.yaml`, Render will auto-detect it and use those settings.

---

## Step 5: Add Environment Variables

In Render Dashboard → Your Service → Environment:

### Required Variables:
```
PORT=10000
FLASK_ENV=production
```

### Optional Variables (for full functionality):

**OpenAI API (for chatbot AI):**
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**MySQL Database:**
```
MYSQL_HOST=your-mysql-host
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DB=your-database-name
```

**Email (Gmail SMTP):**
```
ADMIN_EMAIL=your-email@gmail.com
ADMIN_PASSWORD=your-gmail-app-password
```

**CORS (if needed):**
```
CHATBOT_ALLOWED_ORIGINS=*
```

### How to Add:
1. Go to your service → **Environment** tab
2. Click **"Add Environment Variable"**
3. Add each variable one by one
4. Click **"Save Changes"** (this will trigger a redeploy)

---

## Step 6: Create Database (Optional)

### Option A: Render PostgreSQL (Recommended)

1. **Render Dashboard → "New +" → "PostgreSQL"**
2. **Configure:**
   - **Name:** `damsole-db`
   - **Database:** `damsole_chatbot`
   - **User:** Auto-generated
   - **Region:** Same as web service
   - **Plan:** `Free` (or paid)

3. **Get Connection Details:**
   - Go to database → **Connections** tab
   - Copy: `Internal Database URL` or individual values

4. **Update Environment Variables:**
   ```
   MYSQL_HOST=your-postgres-host
   MYSQL_USER=your-postgres-user
   MYSQL_PASSWORD=your-postgres-password
   MYSQL_DB=damsole_chatbot
   ```

**Note:** If using PostgreSQL, you'll need to update `app.py` to use `psycopg2` instead of `mysql-connector-python`.

### Option B: External MySQL

Use your existing MySQL database and add connection details as environment variables.

---

## Step 7: Deploy & Test

1. **Deploy:**
   - Render will automatically start building and deploying
   - Watch the **Logs** tab for progress

2. **Wait for Deployment:**
   - First deployment takes 5-10 minutes
   - You'll see: "Your service is live at https://your-app-name.onrender.com"

3. **Test Your Website:**
   - **Homepage:** `https://your-app-name.onrender.com/`
   - **About:** `https://your-app-name.onrender.com/about.html`
   - **Portfolio:** `https://your-app-name.onrender.com/Portfolio.html`
   - **Contact:** `https://your-app-name.onrender.com/ContactUs.html`
   - **Health Check:** `https://your-app-name.onrender.com/health`

4. **Test Chatbot:**
   - Open website
   - Click chatbot button (bottom right)
   - Send a test message
   - Verify response

---

## Step 8: Custom Domain (Optional)

1. **Render Dashboard → Your Service → Settings**
2. **Scroll to "Custom Domains"**
3. **Add Domain:**
   - Enter your domain (e.g., `www.damsole.com`)
4. **Update DNS:**
   - Add CNAME record pointing to `your-app-name.onrender.com`
   - Wait for DNS propagation (5-30 minutes)
5. **SSL Certificate:**
   - Render automatically provides free SSL certificate

---

## Troubleshooting

### ❌ Build Fails

**Problem:** `pip install` fails

**Solution:**
- Check `requirements.txt` syntax
- Verify all package names are correct
- Check build logs for specific error

### ❌ App Crashes on Start

**Problem:** Service won't start

**Solution:**
- Check **Logs** tab for error messages
- Verify `startCommand` is correct: `gunicorn main:app --bind 0.0.0.0:$PORT`
- Ensure `PORT` environment variable is set

### ❌ Database Connection Error

**Problem:** Can't connect to database

**Solution:**
- Verify all database environment variables are set
- Check database service is running (if using Render PostgreSQL)
- Test connection string format

### ❌ Chatbot Not Working

**Problem:** Chatbot doesn't respond

**Solution:**
- Check browser console (F12) for errors
- Verify `/chat` endpoint is accessible
- Check `OPENAI_API_KEY` is set (if using AI features)
- Review application logs in Render dashboard

### ❌ Static Files Not Loading

**Problem:** CSS/JS/Images not loading

**Solution:**
- Verify file paths are relative (not absolute)
- Check `static_folder` in `main.py` is correct
- Ensure files are committed to Git

### ❌ Free Tier Sleep Mode

**Problem:** App is slow after inactivity

**Solution:**
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- Consider upgrading to paid plan for always-on service

---

## Important Notes

### Free Tier Limitations:
- ⚠️ Apps sleep after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds
- ⚠️ Limited build minutes per month
- ⚠️ PostgreSQL free tier: 90 days data retention

### Production Recommendations:
- ✅ Use paid plan for always-on service
- ✅ Set up monitoring and alerts
- ✅ Use Render PostgreSQL for production
- ✅ Enable auto-deploy from main branch
- ✅ Set up custom domain with SSL

---

## Quick Checklist

Before deploying:
- [ ] All code pushed to GitHub
- [ ] `requirements.txt` exists in root
- [ ] `main.py` updated for production
- [ ] `.env` file NOT committed (in `.gitignore`)
- [ ] Environment variables ready

After deploying:
- [ ] Service is live
- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Chatbot working
- [ ] Database connected (if using)
- [ ] Email working (if using)

---

## Support

If you encounter issues:
1. Check Render **Logs** tab
2. Review error messages
3. Verify environment variables
4. Test locally first: `python main.py`

---

## Your Live URL

After successful deployment, your website will be available at:
```
https://your-app-name.onrender.com
```

**Congratulations! 🎉 Your website is now live on Render!**

