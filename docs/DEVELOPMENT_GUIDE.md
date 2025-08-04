# JuriBank Development Guide

Complete development guide for the JuriBank UK Legal & Financial Education Platform with freemium subscription model, API integrations, and community features.

## Quick Start

### Prerequisites
- Node.js 18+ (tested with 22.17.0)
- npm 9+
- Git
- Modern web browser
- Understanding of UK legal information sources and APIs
- Educational content creation and accessibility standards
- Student-led project management experience

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

### Educational Platform Architecture
JuriBank features a modern React/TypeScript educational platform with:

**Educational Components** (`/components/`):
- **Learning Dashboard** (`learning-dashboard.tsx`) - Progress tracking and educational milestones
- **Resource Cards** (`resource-cards.tsx`) - Educational content presentation
- **Progress Tracker** (`progress-tracker.tsx`) - Learning journey visualization
- **Guided Assessment** (`guided-assessment.tsx`) - Step-by-step situation understanding
- **Educational Assistant** (`educational-assistant.tsx`) - AI-powered learning support
- **Community Forum** (`community-forum.tsx`) - Peer support and information sharing
- **Subscription Management** (`subscription-manager.tsx`) - Freemium tier management
- **API Content Hub** (`api-content-hub.tsx`) - Real-time official information display

**Mobile-First Responsive Design:**
- Professional design system with consistent branding
- Tailwind CSS configuration optimized for legal professionals
- WCAG AA accessibility compliance throughout
- Progressive web app features for enhanced user experience

### Core Educational Systems
JuriBank includes 8 intelligent educational systems located in `/src/`:

1. **API Content Integration** (`api-content-integration.js`)
   - Real-time Gov.UK API integration for current forms and guidance
   - FCA data feeds for regulatory updates and consumer alerts
   - Financial Ombudsman API for complaint statistics and outcomes
   - Automatic content refresh and currency validation

2. **Educational Resource Engine** (`educational-resource-engine.js`)
   - 2,847+ educational references from authoritative UK sources
   - Student-friendly formatting and explanation
   - Progressive disclosure for complex concepts

3. **Learning Progress System** (`learning-progress-system.js`)
   - Individual progress tracking through educational modules
   - Achievement milestones for understanding key concepts
   - Personalized learning pathways

4. **Community Platform** (`community-platform.js`)
   - Peer support forum with topic categories
   - Student moderation tools and guidelines
   - Information sharing with compliance boundaries

5. **Guided Tool Engine** (`guided-tool-engine.js`)
   - Step-by-step educational wizards
   - Situation assessment and option exploration
   - Template generation for common documents

6. **Subscription Management** (`subscription-management.js`)
   - Freemium tier access control
   - Feature gating and upgrade pathways
   - Usage analytics and engagement tracking

7. **Information Updates** (`information-updates.js`)
   - Real-time monitoring of official information sources
   - Change detection and user notification
   - Content freshness validation

8. **Educational Compliance** (`educational-compliance.js`)
   - Boundary maintenance between information and advice
   - Student moderator support tools
   - Professional referral pathways

### AI Agent System
11 specialized educational agents in `.claude/agents/`:

**Legal Information & Education (6 agents)**:
- UK Regulatory Information Agent
- UK Securities Education Agent  
- FinTech Learning Agent
- AML Education Agent
- Risk Education Agent
- Educational Content Validator

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
- Run comprehensive test suite (`npm run test`)
- Perform security analysis with Code Quality Auditor
- Validate legal content accuracy with Banking Law Validator
- Ensure UK regulatory compliance throughout

### 5. Review Phase
- Document changes thoroughly in relevant documentation files
- Update `tasks/todo.md` and mark completed items
- Ensure compliance with UK banking standards
- Verify OSCOLA citation formatting for legal content
- Update documentation via `/update-docs` command

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

### Educational Content Standards
- Clear, accessible language for learners
- Accurate information from authoritative sources
- UK regulatory information focus
- Student-appropriate complexity levels
- Educational boundaries maintained throughout

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
- Educational platform functionality testing
- API integration reliability testing
- User progress and subscription system testing
- Information accuracy and currency validation
- Community moderation feature testing

## Security Guidelines

### Educational Platform Security Standards
- Student data protection and privacy
- Secure API key management for external integrations
- User authentication and subscription management
- Community moderation and content filtering

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
1. **Educational Accuracy**: All educational content must be reviewed for accuracy and clarity
2. **Student Accessibility**: Maintain accessible language and learning progression
3. **Information Compliance**: Ensure educational boundaries are maintained throughout
4. **Agent Integration**: Utilize specialized educational AI agents for content guidance
5. **Testing**: Comprehensive testing required for all educational platform features

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

## Recent Platform Milestones

### ✅ UK Legal Localization (December 2024)
- **100% terminology conversion** from US to UK legal standards
- **Complete currency conversion** from USD to GBP with professional rates
- **Full regulatory alignment** with UK banking authorities (PRA, FCA, BoE)
- **Professional contact localization** to City of London standards

### ✅ AI Agent Integration (2024)
- **11 specialized agents** fully operational
- **6 legal experts** providing UK regulatory expertise
- **5 development specialists** ensuring banking-grade quality
- **Zero downtime** during agent deployment

### ✅ Educational Platform Transformation (2024)
- **Student-Led Platform** with comprehensive educational tools and community features
- **Freemium Model** with free basic access and premium features
- **API Integration** with Gov.UK, FCA, and Ombudsman for real-time information
- **Community Features** including peer support forum and progress tracking
- **Performance Optimization** with fast loading times and accessible design

### 🔄 Current Development Focus
- **Documentation synchronization** completed via automated `/update-docs`
- **Quality assurance** for new component architecture and portal functionality
- **Performance monitoring** and optimization for Client Portal features

---

*This guide is automatically maintained by the `/update-docs` command and specialized educational development agents.*
**Current Version**: 3.0 - Educational Platform with Freemium Model & API Integration