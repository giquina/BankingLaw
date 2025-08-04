# Smart User Routing: Decision Trees & User Flow Diagrams

## 1. MASTER DECISION TREE VISUALIZATION

### Complete Routing Decision Tree

```
                                    🏠 JURIBANK HOMEPAGE
                                           │
                                    [START SMART ROUTER]
                                           │
                              ┌─────────────────────────┐
                              │   Q1: SITUATION TYPE    │
                              └─────────────────────────┘
                                           │
                ┌──────────────┬───────────┼───────────┬──────────────┬─────────────┐
                │              │           │           │              │             │
         🏦 BANK FEES    💳 CREDIT    📄 INSURANCE   💰 INVESTMENT   📞 SERVICE    ❓ UNSURE
                │              │           │           │              │             │
       ┌────────┼────────┐     │     ┌─────┼─────┐     │        ┌─────┼─────┐       │
       │        │        │     │     │     │     │     │        │     │     │       │
   OVERDRAFT  CHARGES  ADMIN   │    PPI  LIFE  TRAVEL  │    PENSION ADVICE FRAUD    │
       │        │        │     │     │     │     │     │        │     │     │       │
       └────────┼────────┘     │     └─────┼─────┘     │        └─────┼─────┘       │
                │              │           │           │              │             │
                └──────────────┬───────────┼───────────┬──────────────┘             │
                               │           │           │                            │
                              ┌─────────────────────────┐                          │
                              │   Q2: URGENCY LEVEL     │                          │
                              └─────────────────────────┘                          │
                                           │                                       │
                          ┌────────────────┼────────────────┐                     │
                          │                │                │                     │
                    🚨 URGENT         📅 RECENT        ⏰ OLD                    │
                      (0-7 days)      (1-24 months)    (2+ years)               │
                          │                │                │                     │
                          │                │                │                     │
                          │       ┌────────┼────────┐       │                     │
                          │       │        │        │       │                     │
                          │   💷 <£500  💰 £500+  🎯 HIGH   │                     │
                          │       │        │        │       │                     │
                          │       │        │        │       │                     │
                          └───────┬────────┼────────┬───────┘                     │
                                  │        │        │                             │
                                 ┌─────────────────────────┐                      │
                                 │  Q3: SUPPORT LEVEL      │                      │
                                 └─────────────────────────┘                      │
                                          │                                      │
                        ┌─────────────────┼─────────────────┐                    │
                        │                 │                 │                    │
                   📚 EDUCATION      🤝 GUIDANCE      ⚖️ LEGAL                    │
                        │                 │                 │                    │
                        │                 │                 │                    │
                  ┌─────────┐       ┌─────────┐       ┌─────────┐                │
                  │ Q4: IMPACT      │ Q4: IMPACT      │ Q4: IMPACT               │
                  └─────────┘       └─────────┘       └─────────┘                │
                        │                 │                 │                    │
                  ┌─────────┐       ┌─────────┐       ┌─────────┐                │
                  │Q5: EXPERIENCE   │Q5: EXPERIENCE   │Q5: EXPERIENCE            │
                  └─────────┘       └─────────┘       └─────────┘                │
                        │                 │                 │                    │
                        │                 │                 │                    │
                 ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
                 │ EDUCATIONAL  │  │   GUIDED     │  │ PROFESSIONAL │           │
                 │    PATH      │  │    PATH      │  │     PATH     │           │
                 └──────────────┘  └──────────────┘  └──────────────┘           │
                        │                 │                 │                    │
                        │                 │                 │                    │
              ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
              │  Knowledge Hub  │ │ Assessment +    │ │ Case Building + │       │
              │  Free Tools     │ │ Premium Tools   │ │ Legal Referral  │       │
              │  Community      │ │ Progress Track  │ │ Full Service    │       │
              └─────────────────┘ └─────────────────┘ └─────────────────┘       │
                                                                                 │
                                 ┌───────────────────────────────────────────────┘
                                 │
                        ┌─────────────────────────┐
                        │   DIAGNOSTIC PATH       │
                        │  (For "Unsure" users)   │
                        └─────────────────────────┘
                                 │
                      ┌─────────────────────────┐
                      │  Symptom-based questionnaire:  │
                      │  • Bank sent letters?    │
                      │  • Charged unexpected fees? │
                      │  • Account closed suddenly? │
                      │  • Investment lost money?  │
                      │  • Insurance claim denied? │
                      └─────────────────────────┘
                                 │
                        ┌─────────────────┐
                        │  Route to       │
                        │  appropriate    │
                        │  main path      │
                        └─────────────────┘
```

## 2. PATHWAY-SPECIFIC USER FLOWS

### Educational Path User Flow

```
START: User selects "Bank fees" + "Not urgent" + "Just want to understand" + "Under £500" + "Complete beginner"

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SMART ROUTER  │───▶│  PATH GENERATED │───▶│ WELCOME TO YOUR │
│   COMPLETED     │    │  Educational    │    │ LEARNING JOURNEY│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        YOUR EDUCATIONAL PATH                                │
│                                                                             │
│  🎯 Goal: Understand your rights regarding bank charges                     │
│                                                                             │
│  📚 STEP 1: Learn the Basics (15 mins)                                     │
│  ├─ What are unfair bank charges?                                          │
│  ├─ Your rights under UK consumer law                                      │
│  ├─ When charges can be challenged                                         │
│  └─ Success rates by charge type                                           │
│     [Start Learning] ──────────────┐                                       │
│                                    │                                       │
│  🧮 STEP 2: Check Your Situation (5 mins)    ←─────────────────────────    │
│  ├─ Free eligibility checker                                               │
│  ├─ Rough refund estimate                                                  │
│  └─ Next steps recommendation                                              │
│     [Use Calculator] ──────────────┐                                       │
│                                    │                                       │
│  💬 STEP 3: Join the Discussion (Optional)    ←─────────────────────────   │
│  ├─ Read similar cases                                                     │
│  ├─ Ask questions anonymously                                              │
│  └─ Get insights from law students                                         │
│     [Join Community]                                                       │
│                                                                             │
│  🎓 Completion Certificate Available                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │ PROGRESS SAVED  │
                          │ Next steps      │
                          │ recommended     │
                          └─────────────────┘
```

### Professional Path User Flow

```
START: User selects "Investment advice" + "Recent" + "Need legal representation" + "Over £10,000" + "Some experience"

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SMART ROUTER  │───▶│  PATH GENERATED │───▶│ PROFESSIONAL    │
│   COMPLETED     │    │  Professional   │    │ ROUTE STARTED   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     YOUR PROFESSIONAL PATH                                  │
│                                                                             │
│  ⚖️ Goal: Connect you with specialist legal representation                  │
│                                                                             │
│  📋 STEP 1: Complete Detailed Assessment (15 mins)                         │
│  ├─ Full case documentation                                                 │
│  ├─ Timeline of events                                                      │
│  ├─ Evidence collection checklist                                          │
│  ├─ Financial impact calculation                                           │
│  └─ Preliminary case strength analysis                                     │
│     [Start Assessment] ────────────┐                                       │
│                                    │                                       │
│  🔍 STEP 2: Specialist Matching (24 hours)    ←─────────────────────────   │
│  ├─ AI-powered solicitor matching                                          │
│  ├─ 2-3 specialists in investment advice law                               │
│  ├─ Track record verification                                              │
│  ├─ Fee structure comparison                                               │
│  └─ Case transfer preparation                                              │
│     [Matching in Progress...] ─────┐                                       │
│                                    │                                       │
│  🤝 STEP 3: Warm Introduction (48 hours)    ←─────────────────────────     │
│  ├─ Your case details pre-shared                                          │
│  ├─ Solicitor consultation scheduled                                       │
│  ├─ Initial case strategy discussion                                       │
│  └─ Representation agreement review                                        │
│     [Schedule Consultation]                                                │
│                                                                             │
│  📱 Dedicated case manager assigned                                         │
│  💡 Free initial consultation included                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │ PROFESSIONAL    │
                          │ REPRESENTATION  │
                          │ SECURED         │
                          └─────────────────┘
```

### DIY Tools Path User Flow

```
START: User selects "PPI" + "6-24 months ago" + "Help me prepare myself" + "£500-£2000" + "Fairly experienced"

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SMART ROUTER  │───▶│  PATH GENERATED │───▶│ DIY TOOLS       │
│   COMPLETED     │    │  DIY Tools      │    │ DASHBOARD       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       YOUR DIY TOOLKIT                                     │
│                                                                             │
│  🛠️ Goal: Self-service tools to handle your PPI claim                      │
│                                                                             │
│  ✅ INSTANT TOOLS (Available Now)                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 PPI Eligibility Checker      │ 📊 Refund Calculator            │   │
│  │ ⏱️ 2 minutes                    │ ⏱️ 3 minutes                   │   │
│  │ [Start Check] ──┐               │ [Calculate] ─────┐             │   │
│  └─────────────────┼───────────────────────────────────┼─────────────┘   │
│                    │                                   │                 │
│  📝 DOCUMENT BUILDER (Step 2)      ←──────────────────┼─────────────────  │
│  ┌─────────────────┼───────────────────────────────────┼─────────────────┐ │
│  │ 📄 Complaint Letter Generator  │ 📋 Evidence Checklist          │   │
│  │ 📞 Phone Script Builder        │ 📧 Follow-up Email Templates   │   │
│  │ ⏱️ 10 minutes each             │ ⏱️ 5 minutes each              │   │
│  │ [Generate] ──────┐             │ [Download] ──────┐             │   │
│  └──────────────────┼─────────────────────────────────┼─────────────────┘ │
│                     │                                 │                   │
│  📱 PROGRESS TRACKER (Step 3)      ←──────────────────┘                   │
│  ┌──────────────────┼─────────────────────────────────────────────────────┐ │
│  │ 📈 Claim Status Dashboard      │ 📅 Important Dates Tracker    │     │
│  │ 🔔 Automated Reminders         │ 📂 Document Storage            │     │
│  │ 💬 Community Support Access    │ 📊 Progress Analytics          │     │
│  │ [Setup Tracking] ──────────────┼─────────────────────────────────      │
│  └─────────────────────────────────┘                                     │
│                                                                             │
│  🆙 UPGRADE AVAILABLE: Premium support when you need it                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │ CLAIM SUBMITTED │
                          │ Tracking active │
                          │ Support ready   │
                          └─────────────────┘
```

### Emergency Support Path User Flow

```
START: User selects any issue + "Just happened" + "Emergency help" (High urgency trigger)

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SMART ROUTER  │───▶│  EMERGENCY PATH │───▶│ URGENT SUPPORT  │
│   COMPLETED     │    │  ACTIVATED      │    │ INITIATED       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       🚨 EMERGENCY SUPPORT                                  │
│                                                                             │
│  ⚡ Immediate Actions Required                                              │
│                                                                             │
│  🔥 STEP 1: Immediate Protection (Now)                                     │
│  ├─ Document preservation checklist                                        │
│  ├─ Communication freeze guidance                                          │
│  ├─ Account protection steps                                               │
│  └─ Emergency contact numbers                                              │
│     [Access Emergency Kit] ────────┐                                       │
│                                    │                                       │
│  📞 STEP 2: Expert Consultation (Within 2 hours)    ←─────────────────     │
│  ├─ Priority queue for student advisors                                    │
│  ├─ Emergency consultation booking                                         │
│  ├─ Specialist referral if needed                                          │
│  └─ Case escalation to senior students                                     │
│     [Book Emergency Call] ─────────┐                                       │
│                                    │                                       │
│  ⚖️ STEP 3: Professional Escalation (Same day)    ←─────────────────       │
│  ├─ Solicitor network activation                                           │
│  ├─ Same-day consultation available                                        │
│  ├─ Legal aid eligibility check                                            │
│  └─ Court deadline protection                                              │
│     [Escalate to Professional]                                            │
│                                                                             │
│  📱 24/7 Support hotline: 0800-JURIBANK                                   │
│  💬 Live chat with duty law student                                        │
│  📧 emergency@juribank.co.uk                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │ CRISIS MANAGED  │
                          │ Next steps      │
                          │ secure          │
                          └─────────────────┘
```

## 3. INTERACTIVE DECISION TREE COMPONENTS

### Tree Node Component Design

```
Standard Node:
┌─────────────────────────────────────┐
│  🎯 NODE TITLE                      │
│  Brief description of this option   │
│  ──────────────────────────────────  │
│  👥 67% choose this path            │
│  ⏱️ Average time: 15 minutes        │
│  💡 Success rate: 84%               │
│  ──────────────────────────────────  │
│  [Explore This Path →]              │
└─────────────────────────────────────┘

Expanded Node:
┌─────────────────────────────────────┐
│  🎯 NODE TITLE                 [−]  │
│  Detailed description with more     │
│  context about what this involves   │
│  ──────────────────────────────────  │
│  What you'll get:                   │
│  ✓ Immediate eligibility check      │
│  ✓ Refund calculation               │
│  ✓ Step-by-step guidance            │
│  ✓ Template documents               │
│  ──────────────────────────────────  │
│  👥 67% choose this | ⏱️ 15 min     │
│  💡 84% success rate                │
│  ──────────────────────────────────  │
│  [Choose This Path →]               │
│  [See Other Options]                │
└─────────────────────────────────────┘

Terminal Node (Final destination):
┌─────────────────────────────────────┐
│  🏁 DESTINATION: Knowledge Hub       │
│  Your personalized learning center  │
│  ──────────────────────────────────  │
│  What happens next:                 │
│  1. Curated articles for your case  │
│  2. Interactive learning modules    │
│  3. Community discussion access     │
│  4. Progress tracking setup         │
│  ──────────────────────────────────  │
│  ⏱️ Start learning in under 1 minute │
│  ──────────────────────────────────  │
│  [Start Learning Journey →]         │
│  [← Go Back to Explore Other Paths] │
└─────────────────────────────────────┘
```

### Navigation Breadcrumbs

```
🏠 Home > 🎯 Smart Router > 🏦 Bank Issues > 💰 Charges > 📚 Educational Path

Mobile Breadcrumbs:
← Bank Issues > Charges > Educational
```

### Tree Zoom & Focus States

```
Overview Mode (Desktop):
                    🏠 START
                       │
            ┌──────────┼──────────┐
            │          │          │
        🏦 BANK    💳 CREDIT   📄 INSURANCE
            │          │          │
         [Selected] [Dimmed]   [Dimmed]
            │
        🎯 Path Options

Focus Mode (Selected branch expanded):
        🏦 BANK CHARGES
               │
    ┌──────────┼──────────┐
    │          │          │
OVERDRAFT   RETURNED   ADMIN
    │       PAYMENTS      │
    │          │          │
   [+]       [+]        [+]

Mobile Collapsed Mode:
🏦 Bank Charges                    [+]
  └─ Tap to see 3 options

Mobile Expanded Mode:
🏦 Bank Charges                    [−]
  ├─ Overdraft charges             →
  ├─ Returned payment fees         →
  └─ Administration fees           →
```

## 4. MOBILE SWIPE NAVIGATION

### Question Navigation Gestures

```
Swipe Right (←):  Go to previous question
Swipe Left (→):   Go to next question  
Swipe Up (↑):     Show help/more info
Swipe Down (↓):   Minimize current question

Touch Areas:
┌─────────────────────────────────┐
│ [←] Back    [?] Help    [→] Next│  ← Header touch targets (48px)
│                                 │
│ ┌─────────────────────────────┐ │
│ │     QUESTION CONTENT        │ │  ← Main swipe area
│ │                             │ │
│ │     OPTION CARDS            │ │  ← 64px height touch targets
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Back] ──────────── [Continue]  │  ← Footer buttons (56px)
└─────────────────────────────────┘
```

### Tree Navigation on Mobile

```
Tap to expand:
🏦 Bank Issues                     [+]

Expanded with animation:
🏦 Bank Issues                     [−]
  ├─ 💰 Charges          →
  ├─ 📄 Overdrafts       →
  └─ ⚖️ Service issues    →

Drill-down navigation:
← Bank Issues
    💰 Charges                     [+]
      ├─ Overdraft fees    →
      ├─ Admin charges     →
      └─ Late payments     →
```

## 5. ACCESSIBILITY ENHANCED FLOWS

### Screen Reader Navigation Flow

```
Navigation Landmarks:
<nav aria-label="Smart Assessment Progress">
<main aria-label="Question 2 of 5">
<aside aria-label="Help and Support">
<footer aria-label="Navigation Controls">

Heading Structure:
<h1>Smart Assessment</h1>
  <h2>Question 2: What level of help do you need?</h2>
    <h3>Education Option</h3>
    <h3>Guidance Option</h3>
    <h3>Legal Representation Option</h3>

Focus Management:
Question loads → Focus moves to main heading
Option selected → Focus moves to continue button
Next question → Focus moves to new question heading
Results page → Focus moves to results summary
```

### Keyboard Navigation Map

```
Tab Order:
1. Skip to main content link
2. Previous button
3. Help button  
4. Question options (radio group)
   4a. Option 1
   4b. Option 2
   4c. Option 3
   4d. Option 4
   4e. Option 5
5. Continue button
6. Save progress link

Keyboard Shortcuts:
- Tab/Shift+Tab: Navigate between elements
- Arrow Keys: Navigate within radio groups
- Space/Enter: Select options and buttons
- Escape: Close help tooltips/modals
- 1-5: Quick select option numbers
```

### High Contrast Mode Support

```
Normal Mode:
Background: #fefdf8 (background-cream)
Cards: #ffffff (white)
Text: #1f2937 (gray-900)
Accent: #2563eb (student-blue)

High Contrast Mode:
Background: #000000 (black)
Cards: #ffffff (white)
Text: #000000 (black)
Accent: #0066cc (high contrast blue)
Focus: #ffff00 (yellow)
```

## 6. PERFORMANCE-OPTIMIZED LOADING

### Progressive Loading Strategy

```
Initial Load (Critical Path):
┌─────────────────┐
│  SMART ROUTER   │  ← 1. Core router component (10KB)
│  Question 1     │  ← 2. First question only (2KB)
│  Basic styling  │  ← 3. Critical CSS (5KB)
└─────────────────┘
      │
      ▼ User starts interaction
┌─────────────────┐
│  Questions 2-5  │  ← 4. Prefetch remaining questions (8KB)
│  Path logic     │  ← 5. Load routing algorithms (6KB)
│  Help content   │  ← 6. Load help and tooltips (4KB)
└─────────────────┘
      │
      ▼ User completes assessment
┌─────────────────┐
│  Results page   │  ← 7. Load result components (12KB)
│  Path details   │  ← 8. Load specific path content (variable)
│  Next actions   │  ← 9. Load next step components (8KB)
└─────────────────┘

Total Initial Load: 17KB (loads in <500ms on 3G)
```

### Image Optimization

```
Decision Tree Icons:
- SVG format for scalability
- Optimized with SVGO
- Inline for critical icons (<2KB each)
- Lazy load for decorative images

Path Illustrations:
- WebP format with PNG fallback
- Multiple sizes: 320px, 768px, 1024px
- Lazy loading with placeholder
- Compressed to <50KB each
```

## 7. ANALYTICS & HEATMAP INTEGRATION

### User Journey Tracking Points

```
Router Analytics Events:
1. router_started
2. question_1_answered: {situation: "bank-fees"}
3. question_2_answered: {urgency: "recent"}
4. question_3_answered: {support: "education"}
5. question_4_answered: {impact: "medium"}
6. question_5_answered: {experience: "beginner"}
7. path_generated: {type: "educational", confidence: 84%}
8. path_selected: {choice: "educational"}
9. router_completed: {time: 127, satisfaction: "high"}

Drop-off Tracking:
- Question abandonment rates
- Time spent per question
- Help content usage
- Back button usage patterns
```

### A/B Testing Framework

```
Test Variations:
A. Question Order: Situation → Urgency → Support → Impact → Experience
B. Question Order: Support → Situation → Impact → Urgency → Experience
C. Question Count: 3 questions instead of 5
D. Progress Style: Percentage vs step counter vs time remaining

Success Metrics:
- Completion rate (target: >85%)
- Time to complete (target: <120 seconds)
- Path satisfaction (target: >4/5 stars)
- Conversion to action (target: >60%)
```

This comprehensive decision tree and user flow system provides multiple pathways to success, ensuring users can find their optimal solution regardless of their situation complexity, technical experience, or preferred interaction style.