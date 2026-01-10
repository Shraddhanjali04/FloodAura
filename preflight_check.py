#!/usr/bin/env python3
"""
Pre-flight check script for EcoCode application.
Verifies all requirements before starting the application.
"""

import os
import sys
from pathlib import Path

def check_file(filepath, name):
    """Check if a required file exists."""
    if os.path.exists(filepath):
        print(f"✅ {name} found")
        return True
    else:
        print(f"❌ {name} missing")
        return False

def check_env_var(var_name, required=True):
    """Check if an environment variable is set."""
    from dotenv import load_dotenv
    load_dotenv()
    
    value = os.getenv(var_name)
    if value and value != f"your_{var_name.lower()}_here":
        print(f"✅ {var_name} configured")
        return True
    else:
        if required:
            print(f"⚠️  {var_name} not configured (required)")
        else:
            print(f"ℹ️  {var_name} not configured (optional)")
        return not required

def main():
    """Run all pre-flight checks."""
    print("🔍 Running EcoCode Pre-Flight Checks\n")
    print("=" * 50)
    
    all_checks_passed = True
    
    # Check files
    print("\n📁 File Checks:")
    all_checks_passed &= check_file(".env", ".env file")
    all_checks_passed &= check_file("package.json", "package.json")
    all_checks_passed &= check_file("requirements.txt", "requirements.txt")
    all_checks_passed &= check_file("main.py", "main.py")
    all_checks_passed &= check_file("src/App.js", "src/App.js")
    
    # Check environment variables
    print("\n🔑 Backend Environment Variables:")
    all_checks_passed &= check_env_var("DATABASE_URL", required=True)
    all_checks_passed &= check_env_var("OPENWEATHERMAP_API_KEY", required=True)
    all_checks_passed &= check_env_var("SECRET_KEY", required=True)
    check_env_var("GEMINI_API_KEY", required=False)
    check_env_var("GOOGLE_ELEVATION_API_KEY", required=False)
    
    # Check if node_modules exists
    print("\n📦 Dependencies Check:")
    if os.path.exists("node_modules"):
        print("✅ Frontend dependencies installed")
    else:
        print("⚠️  Frontend dependencies not installed. Run: npm install")
        all_checks_passed = False
    
    # Check Python packages
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        print("✅ Backend dependencies installed")
    except ImportError as e:
        print(f"⚠️  Backend dependencies not installed. Run: pip install -r requirements.txt")
        print(f"   Missing: {e}")
        all_checks_passed = False
    
    # Summary
    print("\n" + "=" * 50)
    if all_checks_passed:
        print("✅ All checks passed! Ready to start the application.")
        print("\n🚀 To start the application, run:")
        print("   ./start.sh (macOS/Linux) or start.bat (Windows)")
        return 0
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print("\n📖 See INTEGRATION_SETUP.md for detailed setup instructions.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
