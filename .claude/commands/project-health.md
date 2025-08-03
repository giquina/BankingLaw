---
name: project-health
description: Comprehensive health check and status overview of the JuriBank platform
tools:
  - Read
  - Write
  - Bash
  - LS
  - Grep
  - Glob
---

# JuriBank Project Health Command

This command provides a comprehensive health check and status overview of the entire JuriBank platform.

## Health Check Categories:

### 🏗️ **Core Architecture Health**
- **Agents Status** - All 5 specialist agents operational
- **Core Systems** - 7 legal intelligence systems running
- **Dependencies** - Package versions and security status
- **Configuration** - Environment and deployment settings

### 📊 **Performance Metrics**
- **Build Status** - Compilation and deployment success
- **Test Coverage** - Code quality and test results
- **Load Performance** - Page speed and optimization
- **Error Rates** - System stability and uptime

### 🔧 **Development Environment**
- **Git Status** - Repository health and sync status
- **Branch Status** - Current branch and commit status
- **Deployment Status** - Vercel deployment health
- **Documentation** - Completeness and accuracy

### 📝 **Content Quality**
- **Legal Accuracy** - Citation validation and legal review
- **Brand Consistency** - JuriBank branding compliance
- **Content Freshness** - Last update timestamps
- **SEO Health** - Search optimization status

## Usage:
```
/project-health
```

## Sample Output:
```
🏥 JuriBank Platform Health Check

🟢 **OVERALL STATUS: HEALTHY**

🏗️ **Core Architecture**
✅ Agents: 5/5 operational
✅ Systems: 7/7 running  
✅ Dependencies: 45 packages, 0 vulnerabilities
✅ Configuration: Production ready

📊 **Performance**
✅ Build: ✅ Successful (2.3s)
✅ Tests: 95% coverage (47/50 passing)
✅ Speed: 92/100 (1.2s load time)
✅ Errors: 0.02% error rate

🔧 **Development**
✅ Git: Clean working tree
✅ Branch: main (synced)
✅ Deploy: Live at juribank.vercel.app
✅ Docs: 95% complete

📝 **Content**
✅ Legal: 99.5% accuracy verified
✅ Brand: 100% JuriBank compliant
✅ Fresh: Updated 2 hours ago
✅ SEO: 94/100 optimization score

🎯 **Key Metrics**
- Uptime: 99.97%
- Response Time: 1.2s avg
- User Satisfaction: 4.8/5
- Legal Accuracy: 99.5%

📋 **Recommendations**
1. Update 3 dependencies with patches available
2. Increase test coverage for alert system
3. Optimize 2 images for faster loading

🚀 JuriBank is performing excellently!
```

## Health Status Indicators:
- 🟢 **HEALTHY** - All systems optimal
- 🟡 **WARNING** - Minor issues detected
- 🔴 **CRITICAL** - Immediate attention required
- 🔧 **MAINTENANCE** - Scheduled maintenance mode

## Automatic Monitoring:
This command can be run automatically to:
- Monitor system health 24/7
- Alert on performance degradation
- Track quality metrics over time
- Generate health reports for stakeholders

## Integration:
Works with:
- GitHub Actions for CI/CD monitoring
- Vercel analytics for performance tracking
- Legal review systems for accuracy monitoring
- Error tracking and logging systems

This command ensures the JuriBank platform maintains the highest standards of performance, accuracy, and reliability.