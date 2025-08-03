---
name: init
description: Initialize JuriBank development environment and verify all systems are operational
tools:
  - Read
  - Write
  - Edit
  - Bash
  - LS
  - Grep
  - Glob
---

# JuriBank Initialization Command

This command initializes the complete JuriBank development environment and verifies all systems are operational.

## Initialization Steps:

### 1. Environment Setup
- ✅ **Verify Node.js** - Check Node 18+ installation
- ✅ **Install Dependencies** - Run `npm install` for all packages
- ✅ **Verify Git** - Ensure repository is properly configured
- ✅ **Check Vercel** - Validate deployment configuration

### 2. Agent System Verification
- ✅ **Load All Agents** - Verify 5 specialist agents are accessible
- ✅ **Test YAML Frontmatter** - Validate agent configuration syntax
- ✅ **Check Tools Access** - Ensure agents have proper tool permissions
- ✅ **Verify Context** - Load Claude context and memory files

### 3. Core Systems Check
- ✅ **Regulatory Monitoring** - Test auto-monitoring system
- ✅ **Legal Citation Engine** - Verify citation database
- ✅ **Compliance Calendar** - Check deadline tracking
- ✅ **Learning Database** - Validate educational content
- ✅ **Template System** - Test smart template generation
- ✅ **Alert System** - Verify notification functionality

### 4. Brand Verification
- ✅ **JuriBank Assets** - Verify logo and favicon accessibility
- ✅ **Color Palette** - Confirm brand colors are implemented
- ✅ **Typography** - Check Inter and Open Sans fonts
- ✅ **Professional Images** - Validate real image integration

### 5. Development Tools
- ✅ **Package Scripts** - Test npm run commands
- ✅ **Build Process** - Verify CSS and asset compilation
- ✅ **Linting** - Check code quality standards
- ✅ **Testing** - Run available test suites

## Usage:
```
/init
```

## Expected Output:
```
🚀 JuriBank Initialization Starting...

✅ Environment Setup
   ✅ Node.js 18.17.0 detected
   ✅ Dependencies installed (45 packages)
   ✅ Git repository configured
   ✅ Vercel deployment ready

✅ Agent System
   ✅ UK Regulatory Compliance Specialist - Active
   ✅ UK Securities Law Specialist - Active  
   ✅ UK FinTech Innovation Specialist - Active
   ✅ UK AML Compliance Specialist - Active
   ✅ UK Risk Management Specialist - Active

✅ Core Systems
   ✅ Auto-Regulatory Monitoring - Operational
   ✅ Legal Citation Engine - 2,847 references loaded
   ✅ Compliance Calendar - 156 deadlines tracked
   ✅ Learning Database - 12 courses, 89 cases available
   ✅ Smart Templates - 15 templates ready
   ✅ Alert System - Monitoring active

✅ Brand Assets
   ✅ JuriBank logo and favicon loaded
   ✅ Professional color palette active
   ✅ Typography (Inter/Open Sans) configured
   ✅ Professional images integrated

✅ Development Environment
   ✅ npm scripts operational
   ✅ Build process verified
   ✅ Code quality checks passed
   ✅ All systems green

🎯 JuriBank is ready for development!
```

## Troubleshooting:
If any checks fail, the command will provide specific guidance for resolution:
- **Missing Dependencies** - Will run `npm install`
- **Agent Errors** - Will validate and fix YAML syntax
- **System Failures** - Will restart affected services
- **Asset Missing** - Will regenerate required files

This command ensures a consistent, reliable development environment for all JuriBank contributors.