# Smart User Routing System Design Specification

## Overview
A comprehensive Smart User Routing System that guides users to the right solution within 2 minutes of landing on JuriBank, using progressive disclosure and confidence-building patterns optimized for mobile-first interaction.

## 1. SMART ROUTING INTERFACE DESIGN

### Single Intelligent Entry Point - Homepage Smart Router

**Component: Hero Smart Router**
```
┌─────────────────────────────────────────────────────┐
│  🎯 Find Your Solution in Under 2 Minutes           │
│                                                     │
│  Answer 5 quick questions to get your personalized │
│  pathway to resolution                              │
│                                                     │
│  [START SMART ASSESSMENT] ──→ 🚀                    │
│                                                     │
│  ✓ Confidential  ✓ No signup required             │
│  ✓ 2-minute completion  ✓ Instant results         │
└─────────────────────────────────────────────────────┘
```

**Technical Specifications:**
- Position: Replace "Start Free Assessment" CTA in hero section
- Size: Full-width card, max-width 600px, centered
- Colors: Gradient background (student-blue to student-green)
- Typography: Inter font, 28px headline, 18px body
- Animation: Subtle pulse on CTA button every 3 seconds

### Question Flow Design

**Question 1: Situation Identification**
```
┌─────────────────────────────────────────────────────┐
│  Step 1 of 5: What brings you here today?          │
│  ▓▓▓▓░░░░░░░░░░░░░░░░ 20%                          │
│                                                     │
│  Select the option that best describes your        │
│  situation:                                         │
│                                                     │
│  🏦 [ Bank charged me unfair fees ]                │
│  💳 [ Issues with credit/loans ]                   │
│  📄 [ PPI or insurance problems ]                  │
│  💰 [ Investment/pension advice issues ]           │
│  📞 [ Poor customer service/complaint ]            │
│  ❓ [ Not sure what my issue is ]                  │
│                                                     │
│  [ ← Back ]              [ Continue → ]            │
└─────────────────────────────────────────────────────┘
```

**Question 2: Urgency Assessment**
```
┌─────────────────────────────────────────────────────┐
│  Step 2 of 5: How urgent is this for you?          │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░ 40%                          │
│                                                     │
│  📱 [ This just happened - need help now ]         │
│  📅 [ Within the last 6 months ]                   │
│  🗓️  [ 6 months to 2 years ago ]                  │
│  ⏰ [ Over 2 years ago ]                           │
│  🤔 [ I'm not sure when it started ]               │
│                                                     │
│  [ ← Back ]              [ Continue → ]            │
└─────────────────────────────────────────────────────┘
```

**Question 3: Support Level Needed**
```
┌─────────────────────────────────────────────────────┐
│  Step 3 of 5: What level of help do you need?      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 60%                          │
│                                                     │
│  📚 [ Just want to understand my options ]         │
│  📝 [ Help me prepare my case myself ]             │
│  🤝 [ Guidance throughout the process ]            │
│  ⚖️  [ Need professional legal representation ]    │
│  🆘 [ Emergency - need immediate help ]            │
│                                                     │
│  [ ← Back ]              [ Continue → ]            │
└─────────────────────────────────────────────────────┘
```

**Question 4: Financial Impact**
```
┌─────────────────────────────────────────────────────┐
│  Step 4 of 5: Estimated financial impact?          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 80%                          │
│                                                     │
│  💷 [ Under £100 ]                                 │
│  💰 [ £100 - £500 ]                               │
│  💎 [ £500 - £2,000 ]                             │
│  🏆 [ £2,000 - £10,000 ]                          │
│  🎯 [ Over £10,000 ]                              │
│  ❓ [ I have no idea ]                             │
│                                                     │
│  [ ← Back ]              [ Continue → ]            │
└─────────────────────────────────────────────────────┘
```

**Question 5: Experience Level**
```
┌─────────────────────────────────────────────────────┐
│  Step 5 of 5: Your experience with legal issues?   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%                         │
│                                                     │
│  🆕 [ Complete beginner - need everything explained]│
│  📖 [ Some knowledge but need guidance ]           │
│  🎓 [ Fairly experienced with complaints ]         │
│  ⚖️  [ Have dealt with legal issues before ]       │
│                                                     │
│  [ ← Back ]              [ Get My Results → ]      │
└─────────────────────────────────────────────────────┘
```

## 2. DYNAMIC PATH GENERATION

### Routing Logic Matrix

**Path Generation Algorithm:**
1. **Urgent Issues (Q2: "Just happened")** → Emergency Support Path
2. **Low Financial Impact + Beginner** → Educational Path
3. **High Financial Impact + Professional Help** → Legal Referral Path
4. **Self-Service + Experienced** → DIY Tools Path
5. **Unsure Category** → Diagnostic Path

### Generated Pathways

**Educational Path (Low stakes, learning focused)**
```
┌─────────────────────────────────────────────────────┐
│  🎯 Your Personalized Pathway: LEARN & UNDERSTAND  │
│                                                     │
│  Based on your responses, we recommend:             │
│                                                     │
│  📚 Step 1: Knowledge Hub                          │
│      Learn about your rights and options           │
│      ⏱️ 15-20 minutes                              │
│                                                     │
│  🧮 Step 2: Free Calculator                        │
│      Estimate potential outcomes                    │
│      ⏱️ 5 minutes                                  │
│                                                     │
│  💬 Step 3: Community Discussion                   │
│      Get insights from others with similar issues  │
│      ⏱️ Optional                                   │
│                                                     │
│  [ Start Step 1 → ]                               │
└─────────────────────────────────────────────────────┘
```

**Professional Path (High stakes, complex case)**
```
┌─────────────────────────────────────────────────────┐
│  ⚖️ Your Personalized Pathway: LEGAL REPRESENTATION │
│                                                     │
│  Your case complexity suggests professional help:   │
│                                                     │
│  📋 Step 1: Complete Case Assessment               │
│      Document your situation thoroughly            │
│      ⏱️ 15 minutes                                 │
│                                                     │
│  🔍 Step 2: Specialist Matching                   │
│      We'll find the right solicitor for you       │
│      ⏱️ 24 hours                                   │
│                                                     │
│  🤝 Step 3: Warm Introduction                      │
│      Direct connection with pre-briefed solicitor  │
│      ⏱️ Within 48 hours                            │
│                                                     │
│  [ Start Assessment → ]                            │
└─────────────────────────────────────────────────────┘
```

**DIY Tools Path (Self-sufficient users)**
```
┌─────────────────────────────────────────────────────┐
│  🛠️ Your Personalized Pathway: DIY TOOLS           │
│                                                     │
│  You seem ready to handle this yourself:           │
│                                                     │
│  ✅ Instant Eligibility Check                      │
│  📊 Refund Calculator                              │
│  📝 Letter Templates                               │
│  📋 Complaint Forms                                │
│  📱 Progress Tracker                               │
│                                                     │
│  [ Access All Tools → ]                           │
│                                                     │
│  Need help later? Premium support available        │
└─────────────────────────────────────────────────────┘
```

## 3. VISUAL DECISION TREES

### Interactive Decision Tree Component

**Main Branch Structure:**
```
                     🏠 HOMEPAGE
                         │
                    [Smart Router]
                         │
              ┌──────────┼──────────┐
              │          │          │
         🏦 BANKING   💳 CREDIT   📄 INSURANCE
              │          │          │
         ┌────┼────┐     │     ┌────┼────┐
         │    │    │     │     │    │    │
       FEES OVERDRAFT SERVICE    PPI  LIFE  TRAVEL
         │    │    │           │    │    │
    [Assessment] [Tools]   [Community] [Legal] [DIY]
```

**Interactive Features:**
- Hover states showing next steps
- Click to expand branches
- Back navigation at any level
- Progress indicators
- Estimated time to completion

### Visual Tree Interface Design

**Tree Node Design:**
```
┌─────────────────────┐
│  🎯 Node Title      │
│  Brief description  │
│  ⏱️ 5 min | 👥 High │
│  [Expand ↓]        │
└─────────────────────┘
```

**Branch Connector Styling:**
- Dotted lines for exploration paths
- Solid lines for recommended paths
- Green for completed paths
- Blue for current path
- Gray for alternative paths

## 4. MOBILE-FIRST DESIGN

### Thumb-Optimized Interface

**Touch Target Specifications:**
- Minimum touch target: 48px × 48px
- Spacing between targets: 8px minimum
- Primary actions: 56px × 48px
- Card tap areas: Full card width, 64px height

**Mobile Question Layout:**
```
┌─────────────────────────────────┐
│ ←  Step 2 of 5           [?] │
│                               │
│ 🎯 What brings you here?      │
│                               │
│ ┌───────────────────────────┐ │
│ │ 🏦 Bank charged me fees   │ │
│ │ 💡 Most common (67%)     │ │
│ └───────────────────────────┘ │
│                               │
│ ┌───────────────────────────┐ │
│ │ 💳 Credit/loan issues     │ │
│ │ 💡 Often overlooked      │ │
│ └───────────────────────────┘ │
│                               │
│ ╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲      │
│                               │
│ [←] Back    Continue [→]      │
└─────────────────────────────────┘
```

### Responsive Breakpoints

**Mobile (320px - 768px):**
- Single column layout
- Large touch targets
- Swipe navigation enabled
- Simplified decision trees

**Tablet (768px - 1024px):**
- Two-column option cards
- Side-by-side tree navigation
- Expanded descriptions

**Desktop (1024px+):**
- Full tree visualization
- Hover interactions
- Multiple columns
- Advanced filtering

## 5. ACCESSIBILITY COMPLIANCE (WCAG 2.1 AA)

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space to select options
- Arrow keys for tree navigation
- Escape to go back/cancel

### Screen Reader Support
```html
<div role="navigation" aria-label="Smart Assessment">
  <h2 id="question-heading">Question 1 of 5: What brings you here today?</h2>
  <div role="radiogroup" aria-labelledby="question-heading">
    <label>
      <input type="radio" name="situation" value="bank-fees">
      <span>Bank charged me unfair fees</span>
      <span class="sr-only">Most common issue, affects 67% of users</span>
    </label>
  </div>
</div>
```

### Visual Accessibility
- Color contrast ratio: 4.5:1 minimum
- Focus indicators: 3px blue outline
- Text alternatives for all icons
- Scalable fonts (minimum 16px)

### Cognitive Accessibility
- Clear progress indicators
- Simple language throughout
- One concept per screen
- Consistent navigation patterns

## 6. PROGRESSIVE DISCLOSURE PATTERNS

### Information Layering Strategy

**Level 1: Core Question**
- Primary question only
- Key options visible
- Progress indicator

**Level 2: Context & Help**
- Brief explanations
- Success statistics
- Help tooltips

**Level 3: Advanced Details**
- Full explanations
- Case studies
- Expert guidance

### Disclosure Components

**Info Tooltip:**
```
[?] ← Hover/Click
┌─────────────────────────────┐
│ Bank charges explained:      │
│ • Overdraft fees            │
│ • Returned payment charges  │
│ • Administration fees       │
│                             │
│ Average refund: £200-£800   │
│ Success rate: 73%           │
└─────────────────────────────┘
```

**Expandable Cards:**
```
┌─────────────────────────────┐
│ 🏦 Bank charged me fees [+] │
│ Quick assessment            │
└─────────────────────────────┘
                ↓ Click to expand
┌─────────────────────────────┐
│ 🏦 Bank charged me fees [-] │
│ Quick assessment            │
│ ──────────────────────────  │
│ Includes:                   │
│ • Overdraft charges         │
│ • Returned payments         │
│ • Admin fees                │
│ • Account maintenance       │
│                             │
│ Success rate: 73%           │
│ Average refund: £450        │
└─────────────────────────────┘
```

## 7. CONFIDENCE-BUILDING ELEMENTS

### Trust Indicators Throughout Journey

**Progress Validation:**
```
┌─────────────────────────────┐
│ ✅ Great choice!            │
│ 847 people with similar     │
│ situations got an average   │
│ refund of £650              │
└─────────────────────────────┘
```

**Social Proof Integration:**
- Success statistics at each step
- "Others like you chose..." messaging
- Recent success stories
- Community size indicators

**Expert Validation:**
```
┌─────────────────────────────┐
│ 👨‍⚖️ Law Student Insight:      │
│ "This type of case has a    │
│ strong legal foundation"    │
│ - Sarah, LLB Cambridge      │
└─────────────────────────────┘
```

### Confidence Scoring System

**Real-time Confidence Meter:**
```
Your Case Strength: ▓▓▓▓▓▓▓░░░ 73%
├─ Legal precedent: Strong
├─ Evidence requirement: Medium  
├─ Success probability: High
└─ Estimated timeline: 3-6 months
```

## 8. TECHNICAL IMPLEMENTATION SPECIFICATIONS

### Component Architecture

**Smart Router Component Structure:**
```
SmartRouter/
├── QuestionFlow/
│   ├── Question.jsx
│   ├── ProgressBar.jsx
│   └── NavigationButtons.jsx
├── DecisionTree/
│   ├── TreeNode.jsx
│   ├── TreeBranch.jsx
│   └── TreeNavigation.jsx
├── PathGenerator/
│   ├── RouteEngine.js
│   ├── PathRecommender.js
│   └── ResultsDisplay.jsx
└── MobileOptimized/
    ├── TouchOptimized.jsx
    ├── SwipeNavigation.js
    └── AccessibilityWrapper.jsx
```

### State Management

**Router State Schema:**
```javascript
{
  currentStep: 1,
  answers: {
    situation: '',
    urgency: '',
    supportLevel: '',
    financialImpact: '',
    experience: ''
  },
  generatedPath: {
    type: 'educational|professional|diy|emergency',
    steps: [],
    estimatedTime: '',
    confidenceScore: 0
  },
  userProfile: {
    isReturning: false,
    previousPath: null,
    savedProgress: {}
  }
}
```

### API Integration Points

**Routing Logic API:**
```javascript
POST /api/smart-router/generate-path
{
  answers: RouterAnswers,
  userContext: UserProfile
}

Response:
{
  recommendedPath: PathConfiguration,
  alternativePaths: PathConfiguration[],
  confidenceScore: number,
  reasonings: string[]
}
```

## 9. INTEGRATION WITH EXISTING DESIGN SYSTEM

### Color Palette Integration
- Primary: student-blue (#2563eb)
- Success: student-green (#059669)
- Warning: student-orange (#ea580c)
- Neutral: trust-gray (#64748b)
- Background: background-cream (#fefdf8)

### Typography Scale
- H1: 32px/40px Inter Bold (Mobile: 28px/36px)
- H2: 24px/32px Inter Semibold (Mobile: 20px/28px)
- Body: 16px/24px Inter Regular (Mobile: 16px/24px)
- Caption: 14px/20px Inter Medium (Mobile: 14px/20px)

### Component Consistency
- Border radius: 12px for cards, 8px for buttons
- Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- Transitions: all 0.3s ease
- Focus states: 3px solid rgba(37, 99, 235, 0.5)

## 10. PERFORMANCE OPTIMIZATION

### Loading Strategy
- Progressive component loading
- Route prefetching based on common paths
- Image lazy loading for decision trees
- Minimal JavaScript bundle for initial load

### Caching Strategy
- Router logic cached for 5 minutes
- User progress saved to localStorage
- API responses cached with 10-minute TTL
- Static assets cached for 30 days

## 11. ANALYTICS & OPTIMIZATION

### Key Metrics to Track
- Router completion rate (target: >85%)
- Time to complete assessment (target: <2 minutes)
- Path accuracy (user satisfaction with recommendations)
- Conversion from router to action (target: >60%)

### A/B Testing Framework
- Question ordering optimization
- CTA button text variations
- Progress indicator styles
- Confidence-building message effectiveness

## IMPLEMENTATION PRIORITY

**Phase 1 (Week 1-2):**
- Core 5-question smart router
- Basic path generation
- Mobile-responsive layout

**Phase 2 (Week 3-4):**
- Interactive decision trees
- Advanced accessibility features
- Confidence-building elements

**Phase 3 (Week 5-6):**
- Performance optimization
- Analytics integration
- A/B testing setup

This comprehensive Smart User Routing System will guide users to their optimal solution within 2 minutes while building confidence and ensuring accessibility across all devices.