#!/usr/bin/env python3
"""
Pre-deployment checklist for EcoCode application.
Verifies the project is ready for production deployment.
"""

import os
import sys
import json
from pathlib import Path

def check_file_exists(filepath, name):
    """Check if a required file exists."""
    if os.path.exists(filepath):
        print(f"✅ {name} exists")
        return True
    else:
        print(f"❌ {name} missing")
        return False

def check_gitignore():
    """Verify .env is in .gitignore."""
    try:
        with open('.gitignore', 'r') as f:
            content = f.read()
            if '.env' in content:
                print("✅ .env is in .gitignore (secrets protected)")
                return True
            else:
                print("⚠️  .env not in .gitignore (security risk!)")
                return False
    except FileNotFoundError:
        print("❌ .gitignore not found")
        return False

def check_package_json():
    """Verify package.json has build script."""
    try:
        with open('package.json', 'r') as f:
            data = json.load(f)
            if 'scripts' in data and 'build' in data['scripts']:
                print("✅ package.json has build script")
                return True
            else:
                print("❌ package.json missing build script")
                return False
    except Exception as e:
        print(f"❌ Error reading package.json: {e}")
        return False

def check_requirements():
    """Verify requirements.txt exists and has key dependencies."""
    try:
        with open('requirements.txt', 'r') as f:
            content = f.read()
            required = ['fastapi', 'uvicorn', 'sqlalchemy', 'pydantic']
            missing = [pkg for pkg in required if pkg not in content.lower()]
            
            if not missing:
                print("✅ requirements.txt has all key dependencies")
                return True
            else:
                print(f"⚠️  requirements.txt missing: {', '.join(missing)}")
                return False
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        return False

def main():
    """Run all pre-deployment checks."""
    print("🔍 Running Pre-Deployment Checklist\n")
    print("=" * 60)
    
    all_checks_passed = True
    
    # Check deployment configuration files
    print("\n📁 Deployment Configuration Files:")
    all_checks_passed &= check_file_exists("netlify.toml", "netlify.toml (Frontend config)")
    all_checks_passed &= check_file_exists("render.yaml", "render.yaml (Backend config)")
    all_checks_passed &= check_file_exists(".env.production", ".env.production (Production env template)")
    
    # Check project files
    print("\n📦 Project Files:")
    all_checks_passed &= check_file_exists("package.json", "package.json")
    all_checks_passed &= check_file_exists("requirements.txt", "requirements.txt")
    all_checks_passed &= check_file_exists("main.py", "main.py")
    all_checks_passed &= check_file_exists("src/App.js", "src/App.js")
    
    # Check build configuration
    print("\n🔧 Build Configuration:")
    all_checks_passed &= check_package_json()
    all_checks_passed &= check_requirements()
    
    # Check security
    print("\n🔒 Security:")
    all_checks_passed &= check_gitignore()
    
    # Check if .env exists (should exist but not be committed)
    if os.path.exists('.env'):
        print("✅ .env exists (for local development)")
    else:
        print("⚠️  .env not found (needed for local testing)")
    
    # Git check
    print("\n📚 Version Control:")
    if os.path.exists('.git'):
        print("✅ Git repository initialized")
        print("ℹ️  Run 'git remote -v' to verify GitHub connection")
    else:
        print("⚠️  Git not initialized. Run: git init")
        all_checks_passed = False
    
    # Documentation
    print("\n📖 Documentation:")
    check_file_exists("DEPLOYMENT_GUIDE.md", "DEPLOYMENT_GUIDE.md")
    check_file_exists("QUICK_DEPLOY.md", "QUICK_DEPLOY.md")
    check_file_exists("README.md", "README.md")
    
    # Summary
    print("\n" + "=" * 60)
    if all_checks_passed:
        print("✅ All critical checks passed! Ready for deployment.")
        print("\n🚀 Next Steps:")
        print("   1. Push code to GitHub: git push origin main")
        print("   2. Deploy backend to Render: See DEPLOYMENT_GUIDE.md")
        print("   3. Deploy frontend to Netlify: See QUICK_DEPLOY.md")
        print("\n📖 Quick guide: cat QUICK_DEPLOY.md")
        return 0
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print("\n📖 For help, see: DEPLOYMENT_GUIDE.md")
        return 1

if __name__ == "__main__":
    sys.exit(main())
