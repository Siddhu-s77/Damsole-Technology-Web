"""
Quick script to create database tables using SQLAlchemy
Run this from project root: python create_tables.py
"""

import sys
import os

# Add DamsoleAIChatbot to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'DamsoleAIChatbot'))

from app import app, db, Lead

def create_tables():
    """Create all database tables"""
    try:
        with app.app_context():
            db.create_all()
            print("✅ Tables created successfully!")
            print("✅ Database: MySQL")
            print("✅ Table: leads")
            return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔄 Creating database tables...")
    create_tables()

