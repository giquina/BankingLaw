# JuriBank Phase 1 Strategic Wireframe
## Student-Led Legal & Financial Help Platform

### 🎯 VISION ALIGNMENT
**Current Status**: ✅ Platform correctly identifies as student-led educational platform
**Gap**: Need to implement tiered access system and API-driven content

---

## 📱 WIREFRAME STRUCTURE

### 1. **HOMEPAGE** (Public - No Login Required)
```
┌─────────────────────────────────────────────────────────────┐
│ [JuriBank Logo] Navigation: Home | About | Free Tools | Login │
├─────────────────────────────────────────────────────────────┤
│                    HERO SECTION                            │
│ "Legal & Financial Help by Law Students"                   │
│ "We guide you through your options - no legal advice"      │
│ [Try Free Tools] [Sign Up for More]                       │
├─────────────────────────────────────────────────────────────┤
│                 TRUST BUILDERS                             │
│ ✓ Created by LLB Students  ✓ Educational Only             │
│ ✓ Real Gov/Regulatory Data ✓ Community Moderated          │
├─────────────────────────────────────────────────────────────┤
│              FREE TOOLS PREVIEW                            │
│ [Quick Claim Check] [Banking Error Guide] [FAQ Search]     │
├─────────────────────────────────────────────────────────────┤
│                 FEATURE COMPARISON                          │
│ Free Tier vs Paid Tier explanation                        │
└─────────────────────────────────────────────────────────────┘
```

### 2. **FREE TOOLS SECTION** (No Login Required)
```
┌─────────────────────────────────────────────────────────────┐
│              GUIDED CLAIM TOOL (LIMITED)                   │
│ Step 1: What type of issue?                                │
│ [Banking Error] [Loan Issue] [Payment Problem]             │
│                                                            │
│ Step 2: Quick eligibility check                            │
│ [Yes/No questions with simple logic]                       │
│                                                            │
│ Step 3: Basic guidance                                     │
│ "You may be eligible for X. Here's how to start..."       │
│ [Upgrade to Full Tool] [Download Basic Guide]              │
└─────────────────────────────────────────────────────────────┘
```

### 3. **USER DASHBOARD** (Post-Login)
```
┌─────────────────────────────────────────────────────────────┐
│ Welcome [User] | [Upgrade to Paid] | [Account] | [Logout]   │
├─────────────────────────────────────────────────────────────┤
│                  PERSONALIZED FEED                         │
│ 📈 Your Activity Timeline                                  │
│ • Completed Banking Error Guide - 2 days ago              │
│ • Bookmarked FCA Regulation Update - 1 week ago           │
│ • Asked question in Community - 1 week ago                │
├─────────────────────────────────────────────────────────────┤
│                  QUICK ACTIONS                             │
│ [Continue Claim Tool] [Browse Knowledge Hub] [Ask Community]│
├─────────────────────────────────────────────────────────────┤
│               SAVED ITEMS (Free: 3 max)                   │
│ 📁 My Documents (2/3)                                     │
│ 🔖 My Bookmarks (1/3)                                     │
│ [Upgrade for Unlimited]                                   │
├─────────────────────────────────────────────────────────────┤
│                API-POWERED UPDATES                         │
│ 🔔 Latest from Gov.UK, FCA, Ombudsman                     │
│ [Auto-refreshed content cards]                            │
└─────────────────────────────────────────────────────────────┘
```

### 4. **GUIDED CLAIM TOOL** (Interactive Wizard)
```
┌─────────────────────────────────────────────────────────────┐
│              CLAIM WIZARD - STEP 2 OF 7                    │
│ Progress: ████████░░░░░░░  57%                             │
├─────────────────────────────────────────────────────────────┤
│ Question: "When did this issue first occur?"               │
│                                                            │
│ ( ) Within the last 6 months                              │
│ ( ) 6 months to 2 years ago                               │
│ ( ) More than 2 years ago                                 │
│                                                            │
│ ℹ️ Why we ask: Time limits affect your options            │
├─────────────────────────────────────────────────────────────┤
│ [Back] [Save Progress] [Continue] [Need Help?]             │
│                                                            │
│ 💡 Tip: You can save and return to this later             │
└─────────────────────────────────────────────────────────────┘
```

### 5. **KNOWLEDGE HUB** (API-Driven Content)
```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT DISCOVERY                       │
│ [Search Box: "banking complaints, loan issues..."]         │
│                                                            │
│ Filters: [Content Type] [Date] [Source] [Topic]           │
├─────────────────────────────────────────────────────────────┤
│              LIVE CONTENT FEED                             │
│ 📄 New FCA Guidance on Banking Complaints                 │
│    Updated 2 hours ago | Source: FCA.org.uk               │
│    [Read] [Bookmark] [Share]                              │
│                                                            │
│ 📊 Ombudsman Annual Report Released                        │
│    Updated 1 day ago | Source: Financial-ombudsman.org.uk │
│    [Read] [Bookmark] [Share]                              │
│                                                            │
│ 💡 Student Analysis: "How to challenge bank charges"       │
│    By JuriBank Team | Educational Content                 │
│    [Read] [Bookmark] [Share]                              │
└─────────────────────────────────────────────────────────────┘
```

### 6. **COMMUNITY FORUM** (Moderated)
```
┌─────────────────────────────────────────────────────────────┐
│                 ASK THE COMMUNITY                          │
│ [Ask Question] [Browse Topics] [My Questions]              │
├─────────────────────────────────────────────────────────────┤
│                TOPIC CATEGORIES                            │
│ 🏦 Banking Issues (245 questions)                         │
│ 💳 Payment Problems (89 questions)                        │
│ 🏠 Mortgage Disputes (156 questions)                      │
│ 👩‍🎓 Student Help (67 questions)                           │
├─────────────────────────────────────────────────────────────┤
│                RECENT QUESTIONS                            │
│ Q: "Bank charged me twice for the same transaction"        │
│    📍 Banking Issues | 3 helpful replies | 2 hours ago    │
│                                                            │
│ Q: "Loan company won't provide payment breakdown"          │
│    📍 Payment Problems | 1 reply | 5 hours ago            │
│                                                            │
│ ⚠️ Reminder: We provide guidance, not legal advice        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **TECHNICAL REQUIREMENTS**

### API Integration Points:
1. **GOV.UK API** - Government guidance updates
2. **FCA API** - Financial Conduct Authority updates  
3. **Financial Ombudsman API** - Complaint guidance
4. **Court Service API** - Legal process information

### User Management:
1. **Free Tier Limits**:
   - 3 saved documents/bookmarks
   - Basic claim tool (limited claim types)
   - Weekly email updates
   - Forum access

2. **Paid Tier Features**:
   - Unlimited saves
   - Full claim tool access
   - Real-time alerts
   - Priority community access
   - Custom dashboards

### Data Structure:
```javascript
User Profile:
- id, email, tier (free/paid)
- savedItems: [max 3 for free]
- claimProgress: []
- communityActivity: []
- alertPreferences: {}
```

---

## 📱 **MOBILE-FIRST CONSIDERATIONS**

### Mobile Layout Priority:
1. **Collapsible navigation**
2. **Swipeable claim wizard steps**
3. **Card-based content discovery**
4. **Thumb-friendly community interface**
5. **Progressive web app features**

---

## 🎨 **DESIGN SYSTEM ALIGNMENT**

### Colors (Already Implemented):
- Navy (#0D1B2A) - Authority & Trust
- Gold (#F4C430) - Premium Features  
- Blue (#3A86FF) - Interactive Elements
- Gray (#F4F4F4) - Clean Backgrounds

### Typography:
- Headings: Inter (Clean, Modern)
- Body: Open Sans (Readable)
- Legal Text: Georgia (Traditional)

---

## ⚡ **DEVELOPMENT PHASES**

### Phase 1A (MVP):
- ✅ Homepage with trust builders
- ✅ Basic claim tool (free tier)
- ✅ Simple user registration
- ✅ Community forum structure

### Phase 1B (Enhanced):
- 🔄 API integrations for live content
- 🔄 User dashboard with saved items
- 🔄 Subscription system (Stripe)
- 🔄 Advanced claim wizard

### Phase 1C (Full):
- 🔄 Real-time notifications
- 🔄 Custom dashboards
- 🔄 Advanced filtering
- 🔄 Mobile app features

---

## 🎯 **SUCCESS METRICS**

### User Engagement:
- Free tool completion rate > 60%
- Free-to-paid conversion > 5%
- Community participation > 40%
- Content bookmark rate > 25%

### Trust Indicators:
- Clear student identification
- Transparent non-advice messaging
- User feedback > 4.2/5
- Low bounce rate < 40%