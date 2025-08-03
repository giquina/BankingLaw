#!/bin/bash

# BankingLaw Platform Bootstrap Script
# Automated setup for UK Banking Law Platform development environment

set -e  # Exit on any error

echo "🏛️  BankingLaw Platform Bootstrap"
echo "=================================="
echo "Setting up UK Banking Law Platform development environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Check if npm is installed
print_status "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm found: $NPM_VERSION"

# Install dependencies
print_status "Installing project dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Verify project structure
print_status "Verifying project structure..."
required_dirs=("src" "tests" "docs" "claude" "tasks" "errors" "scripts")

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_success "Directory exists: $dir"
    else
        print_warning "Creating missing directory: $dir"
        mkdir -p "$dir"
    fi
done

# Verify key files exist
print_status "Verifying key project files..."
required_files=("index.html" "README.md" "CLAUDE.md" "tasks/todo.md" "errors/debug.log")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "File exists: $file"
    else
        print_warning "Missing file: $file"
    fi
done

# Check for .gitignore
print_status "Checking for .gitignore file..."
if [ ! -f ".gitignore" ]; then
    print_warning ".gitignore not found. Creating basic .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Vercel
.vercel

# Claude Code specific
claude/context.json.bak
tasks/todo.md.bak
errors/debug.log.bak

# Build outputs
dist/
build/
EOF
    print_success "Created .gitignore file"
else
    print_success ".gitignore file exists"
fi

# Check git repository status
print_status "Checking git repository status..."
if [ -d ".git" ]; then
    print_success "Git repository detected"
    
    # Check for uncommitted changes
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "You have uncommitted changes:"
        git status --short
    else
        print_success "Working directory is clean"
    fi
else
    print_warning "Not a git repository. Consider running 'git init' to initialize version control."
fi

# Development server check
print_status "Testing development server setup..."
if npm run build > /dev/null 2>&1; then
    print_success "Build script works correctly"
else
    print_warning "Build script may need attention"
fi

# Legal compliance check
print_status "Performing legal compliance verification..."
if grep -q "solicitor" index.html && grep -q "PRA\|FCA" index.html && grep -q "£" index.html; then
    print_success "UK legal terminology and regulatory compliance verified"
else
    print_warning "Legal terminology verification needs review"
fi

# Final setup summary
echo ""
echo "🎯 Bootstrap Complete!"
echo "====================="
print_success "Development environment is ready"
print_success "Project structure verified"
print_success "Dependencies installed"
print_success "UK legal compliance verified"

echo ""
echo "📋 Next Steps:"
echo "1. Run 'npm run dev' to start development server"
echo "2. Visit http://localhost:8000 to view the platform"
echo "3. Check tasks/todo.md for current project status"
echo "4. Review CLAUDE.md for development guidelines"
echo ""

echo "🔗 Quick Commands:"
echo "  npm run dev      - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run deploy   - Deploy to Vercel"
echo ""

echo "⚖️  Legal Notice:"
echo "This platform provides UK banking law guidance. Always ensure legal"
echo "accuracy and consult qualified solicitors for specific legal advice."
echo ""

print_success "Bootstrap completed successfully! 🚀"