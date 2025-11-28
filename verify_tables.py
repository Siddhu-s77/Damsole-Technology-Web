"""
Verify database tables were created successfully
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'DamsoleAIChatbot'))

from app import app, db, Lead
from sqlalchemy import inspect

def verify_tables():
    """Verify tables exist in database"""
    try:
        with app.app_context():
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            print("\n" + "="*50)
            print("📊 Database Verification")
            print("="*50)
            
            if 'leads' in tables:
                print("✅ Table 'leads' exists!")
                
                # Check columns
                columns = inspector.get_columns('leads')
                print(f"\n📋 Columns in 'leads' table:")
                for col in columns:
                    print(f"   - {col['name']} ({col['type']})")
                
                # Count records
                count = db.session.query(Lead).count()
                print(f"\n📈 Total records: {count}")
                
            else:
                print("❌ Table 'leads' not found!")
                print(f"Available tables: {tables}")
            
            print("="*50 + "\n")
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    verify_tables()

