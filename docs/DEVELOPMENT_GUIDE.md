# JuriBank Development Guide

Complete development guide for the JuriBank UK Banking Law Intelligence Platform.

## Quick Start

### Prerequisites
- Node.js 18+ (tested with 22.17.0)
- npm 9+
- Git
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/giquina/juribank.git
cd BankingLaw

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:8000
```

## Development Commands

### Core Commands
```bash
npm run dev          # Start development server (port 8000)
npm run build        # Build for production with Tailwind CSS
npm run preview      # Preview production build
```

### Quality Assurance
```bash
npm run lint         # Run ESLint code analysis
npm run format       # Format code with Prettier
npm run test         # Run Jest test suite
```

### Platform Management
```bash
npm run health       # JuriBank platform health check
npm run agents:validate  # Validate all AI agents
```

### Claude Code Commands
```bash
/init               # Initialize complete JuriBank environment
/update-docs        # Update all documentation
/project-health     # Comprehensive project status
```

## Architecture Overview

### Core Intelligence Systems
JuriBank includes 8 intelligent systems located in `/src/`:

1. **Auto-Regulatory Monitoring** (`auto-regulatory-monitoring.js`)
   - 6 monitoring sources (PRA, FCA, BoE, Parliament, Basel Committee)
   - 5 automation rules for intelligent alerting
   - Hourly monitoring of critical regulatory sources

2. **Legal Citation Engine** (`legal-citation-engine.js`)
   - 2,847+ UK legal references
   - OSCOLA-compliant citation formatting
   - Pattern-based citation recognition

3. **Compliance Calendar** (`compliance-calendar.js`)
   - 156+ tracked regulatory deadlines
   - Automated reminder system
   - Business day calculations for UK banking

4. **Learning Database** (`learning-database.js`)
   - 12 educational courses
   - 89 case studies
   - Interactive legal content

5. **Legal Templates** (`legal-templates.js`)
   - 15+ smart document templates
   - Intelligent pre-filling
   - Banking compliance templates

6. **Regulatory Alerts** (`regulatory-alerts.js`)
   - Intelligent notification system
   - Priority-based escalation
   - Multi-channel delivery

7. **Regulatory Updates** (`regulatory-updates.js`)
   - Real-time regulatory change tracking
   - Impact analysis and assessment
   - Professional notification formatting

8. **Jurisdiction Mapping** (`jurisdiction-mapping.js`)
   - UK vs EU law distinctions
   - Post-Brexit regulatory mapping
   - Cross-border compliance guidance

### AI Agent System
11 specialized agents in `.claude/agents/`:

**Legal & Regulatory (6 agents)**:
- UK Regulatory Compliance Agent
- UK Securities Law Agent  
- FinTech Innovation Agent
- AML Compliance Agent
- Risk Management Agent
- Banking Law Validator

**Development & Quality (5 agents)**:
- Legal Documentation Agent
- Code Quality Auditor
- Test Architect
- Configuration Manager
- UI/UX Designer

## Development Workflow

### 1. Planning Phase
- Create detailed todo list in `tasks/todo.md`
- Use TodoWrite tool for task tracking
- Define clear acceptance criteria

### 2. Research Phase
- Utilize appropriate AI agents for domain expertise
- Read existing codebase for context
- Validate legal requirements with regulatory agents

### 3. Implementation Phase
- Follow JuriBank coding standards
- Implement incremental changes
- Maintain legal accuracy throughout

### 4. Quality Assurance Phase
- Run comprehensive test suite
- Perform security analysis
- Validate legal content accuracy

### 5. Review Phase
- Document changes thoroughly
- Update todos and mark completed
- Ensure compliance with banking standards

## Coding Standards

### JavaScript Standards
- ES6+ modern JavaScript
- Consistent naming conventions
- Comprehensive error handling
- Banking-grade security practices

### CSS Standards
- Tailwind CSS for styling
- JuriBank design system compliance
- Responsive design principles
- Accessibility standards (WCAG AA)

### Legal Content Standards
- OSCOLA citation formatting
- Professional legal terminology
- UK regulatory compliance focus
- Solicitor-grade accuracy requirements

## Testing Strategy

### Test Structure
```
tests/
├── unit/           # Unit tests for individual components
├── integration/    # API and system integration tests
├── e2e/           # End-to-end workflow tests
├── compliance/    # Regulatory compliance validation
├── security/      # Security and penetration tests
├── performance/   # Load and performance tests
└── fixtures/      # Test data and mock objects
```

### Testing Requirements
- Banking-grade test coverage
- Regulatory compliance validation
- Financial data integrity testing
- Security vulnerability assessment

## Security Guidelines

### Banking Security Standards
- Secure by default configurations
- Input validation and sanitization
- Authentication and authorization patterns
- Audit trail implementation

### Development Security
- Dependency vulnerability scanning
- Secure coding practices
- Error handling without information disclosure
- HTTPS and security header implementation

## Brand Guidelines

### JuriBank Visual Identity
```css
/* Core Brand Colors */
--juribank-navy: #0D1B2A;    /* Authority & Trust */
--juribank-gold: #F4C430;    /* Premium & Excellence */
--juribank-off-white: #FAFAFA; /* Clean & Professional */
--juribank-gray: #D9D9D9;    /* Subtle Sophistication */

/* Typography */
--font-heading: 'Inter', sans-serif;     /* Modern, Clean */
--font-body: 'Open Sans', sans-serif;    /* Readable, Professional */
--font-legal: 'Georgia', serif;          /* Traditional, Academic */
```

### Design Principles
- Professional credibility
- Trust and authority
- Clean, sophisticated aesthetics
- Accessibility compliance
- Mobile-first responsive design

## Deployment

### Vercel Deployment
- Automatic deployment from main branch
- Static site optimization
- CDN distribution
- HTTPS by default

### Environment Configuration
- Development: Local server with hot reload
- Production: Optimized build with minification
- Testing: Isolated test environment

## Contributing Guidelines

### Code Contributions
1. **Legal Accuracy**: All legal content must be reviewed for accuracy
2. **Professional Standards**: Maintain solicitor-grade documentation quality
3. **Regulatory Compliance**: Ensure UK banking law compliance throughout
4. **Agent Integration**: Utilize specialized AI agents for domain expertise
5. **Testing**: Comprehensive testing required for all banking features

### Documentation Requirements
- Update relevant documentation for all changes
- Maintain CLAUDE.md agent configurations
- Keep README.md current with project status
- Document API changes and new features

### Quality Gates
- All tests must pass
- Security analysis clean
- Legal content validated
- Code review completed
- Documentation updated

---

*This guide is automatically maintained by the `/update-docs` command and specialized development agents.*