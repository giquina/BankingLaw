// Interactive Learning and Case Database
// UK Banking Law Platform - Educational Resources and Case Studies

class LearningDatabase {
    constructor() {
        this.coursesDatabase = new Map();
        this.casesDatabase = new Map();
        this.articlesDatabase = new Map();
        this.quizzesDatabase = new Map();
        this.userProgress = new Map();
        this.searchIndex = new Map();
        
        this.initializeLearningContent();
    }

    // Initialize comprehensive learning content
    initializeLearningContent() {
        console.log('📚 Initializing UK Banking Law Learning Database...');
        
        this.addCourse({
            id: 'uk-banking-regulation-fundamentals',
            title: 'UK Banking Regulation Fundamentals',
            category: 'Regulatory Compliance',
            level: 'Beginner',
            duration: '4 hours',
            modules: [
                {
                    id: 'module-1',
                    title: 'Introduction to UK Banking Regulation',
                    content: `
                        <h3>The UK Banking Regulatory Framework</h3>
                        <p>The UK banking sector operates under a comprehensive regulatory framework designed to ensure financial stability, consumer protection, and market integrity.</p>
                        
                        <h4>Key Regulatory Bodies:</h4>
                        <ul>
                            <li><strong>Bank of England (BoE)</strong>: Central bank responsible for monetary policy and financial stability</li>
                            <li><strong>Prudential Regulation Authority (PRA)</strong>: Responsible for prudential regulation of banks, building societies, credit unions, insurers, and major investment firms</li>
                            <li><strong>Financial Conduct Authority (FCA)</strong>: Regulates conduct of business for all financial services firms and prudential regulation of smaller firms</li>
                        </ul>
                        
                        <h4>Core Legislation:</h4>
                        <ul>
                            <li>Financial Services and Markets Act 2000 (FSMA)</li>
                            <li>Banking Act 2009</li>
                            <li>Financial Services Act 2012</li>
                            <li>Financial Services Act 2021</li>
                        </ul>
                    `,
                    quiz_id: 'uk-reg-basics-quiz'
                },
                {
                    id: 'module-2',
                    title: 'Capital Requirements and Basel III',
                    content: `
                        <h3>UK Implementation of Basel III</h3>
                        <p>The UK has implemented Basel III through the Capital Requirements Regulation (CRR) and Capital Requirements Directive (CRD V).</p>
                        
                        <h4>Key Capital Requirements:</h4>
                        <ul>
                            <li><strong>Common Equity Tier 1 (CET1)</strong>: Minimum 4.5% of risk-weighted assets</li>
                            <li><strong>Tier 1 Capital</strong>: Minimum 6% of risk-weighted assets</li>
                            <li><strong>Total Capital</strong>: Minimum 8% of risk-weighted assets</li>
                            <li><strong>Leverage Ratio</strong>: Minimum 3% of total exposure</li>
                        </ul>
                        
                        <h4>Capital Buffers:</h4>
                        <ul>
                            <li>Capital Conservation Buffer: 2.5%</li>
                            <li>Countercyclical Buffer: 0-2.5% (variable)</li>
                            <li>G-SII Buffer: 1-3.5% for global systemically important institutions</li>
                        </ul>
                    `,
                    quiz_id: 'capital-requirements-quiz'
                }
            ],
            case_studies: ['barings-collapse-case', 'northern-rock-crisis'],
            assessment: 'uk-banking-regulation-assessment'
        });

        this.addCourse({
            id: 'consumer-duty-implementation',
            title: 'Consumer Duty Implementation',
            category: 'Consumer Protection',
            level: 'Intermediate',
            duration: '3 hours',
            modules: [
                {
                    id: 'cd-module-1',
                    title: 'Consumer Duty Overview',
                    content: `
                        <h3>FCA Consumer Duty</h3>
                        <p>The Consumer Duty represents a fundamental shift in UK financial services regulation, focusing on outcomes rather than just processes.</p>
                        
                        <h4>The Consumer Principle:</h4>
                        <p>"A firm must act to deliver good outcomes for retail customers."</p>
                        
                        <h4>Four Outcomes:</h4>
                        <ul>
                            <li><strong>Products and Services</strong>: Fit for purpose and meet customers' needs</li>
                            <li><strong>Price and Value</strong>: Fair value and reasonable price</li>
                            <li><strong>Consumer Understanding</strong>: Clear, timely, and accessible communications</li>
                            <li><strong>Consumer Support</strong>: Customer service that enables good outcomes</li>
                        </ul>
                    `,
                    quiz_id: 'consumer-duty-basics-quiz'
                }
            ],
            case_studies: ['consumer-duty-implementation-case'],
            assessment: 'consumer-duty-assessment'
        });

        // Add comprehensive case studies
        this.addCaseStudy({
            id: 'barings-collapse-case',
            title: 'The Barings Bank Collapse (1995)',
            category: 'Operational Risk',
            level: 'Advanced',
            summary: 'Analysis of the £827 million trading loss that brought down Britain\'s oldest merchant bank',
            content: `
                <h3>Background</h3>
                <p>Barings Bank, founded in 1762, was Britain's oldest merchant bank when it collapsed in February 1995 due to unauthorized trading by Nick Leeson in Singapore.</p>
                
                <h3>Key Events</h3>
                <ul>
                    <li><strong>1992-1995</strong>: Nick Leeson builds up massive unauthorized positions</li>
                    <li><strong>Account 88888</strong>: Secret error account used to hide trading losses</li>
                    <li><strong>Kobe Earthquake</strong>: January 1995 earthquake triggers massive losses</li>
                    <li><strong>February 26, 1995</strong>: Bank declares insolvency with £827m losses</li>
                </ul>
                
                <h3>Regulatory Failures</h3>
                <ul>
                    <li>Inadequate oversight of overseas operations</li>
                    <li>Lack of segregation of trading and settlement functions</li>
                    <li>Insufficient risk management controls</li>
                    <li>Poor supervision by Bank of England</li>
                </ul>
                
                <h3>Lessons Learned</h3>
                <ul>
                    <li>Importance of operational risk management</li>
                    <li>Need for effective internal controls</li>
                    <li>Regular reconciliation of positions</li>
                    <li>Management oversight of overseas operations</li>
                </ul>
                
                <h3>Regulatory Changes</h3>
                <p>The collapse led to significant reforms in UK banking supervision and the eventual creation of the FSA (later PRA and FCA).</p>
            `,
            learning_objectives: [
                'Understand operational risk in banking',
                'Analyze control failures and their consequences',
                'Evaluate regulatory supervision effectiveness',
                'Apply lessons to modern risk management'
            ],
            related_topics: ['operational-risk', 'internal-controls', 'trading-risk'],
            discussion_questions: [
                'What control failures enabled the unauthorized trading?',
                'How could modern risk management have prevented this collapse?',
                'What regulatory changes resulted from this case?'
            ]
        });

        this.addCaseStudy({
            id: 'northern-rock-crisis',
            title: 'Northern Rock Crisis (2007-2008)',
            category: 'Liquidity Risk',
            level: 'Advanced',
            summary: 'The first UK bank run in over 140 years and subsequent nationalization',
            content: `
                <h3>Background</h3>
                <p>Northern Rock was a UK bank that experienced the first bank run in the UK for over 140 years, leading to its nationalization in 2008.</p>
                
                <h3>Business Model</h3>
                <ul>
                    <li>Heavy reliance on wholesale funding markets</li>
                    <li>Aggressive mortgage lending strategy</li>
                    <li>Securitization of mortgage portfolios</li>
                    <li>Limited retail deposits base</li>
                </ul>
                
                <h3>Crisis Timeline</h3>
                <ul>
                    <li><strong>August 2007</strong>: Credit crunch begins, wholesale funding becomes scarce</li>
                    <li><strong>September 13, 2007</strong>: Northern Rock requests emergency funding from BoE</li>
                    <li><strong>September 14, 2007</strong>: News breaks, triggering bank run</li>
                    <li><strong>September 17, 2007</strong>: Government guarantees all deposits</li>
                    <li><strong>February 2008</strong>: Bank nationalized</li>
                </ul>
                
                <h3>Regulatory Issues</h3>
                <ul>
                    <li>Inadequate liquidity risk supervision</li>
                    <li>Overreliance on market-based funding model</li>
                    <li>Insufficient stress testing of funding strategies</li>
                    <li>Poor crisis management procedures</li>
                </ul>
                
                <h3>Regulatory Response</h3>
                <ul>
                    <li>Enhanced liquidity requirements (Basel III LCR/NSFR)</li>
                    <li>Improved supervision of business models</li>
                    <li>Better deposit guarantee schemes</li>
                    <li>Special resolution regime for banks</li>
                </ul>
            `,
            learning_objectives: [
                'Understand liquidity risk and funding models',
                'Analyze the impact of market-based funding',
                'Evaluate crisis management responses',
                'Apply lessons to current liquidity regulation'
            ],
            related_topics: ['liquidity-risk', 'funding-models', 'crisis-management'],
            discussion_questions: [
                'What made Northern Rock\'s business model vulnerable?',
                'How effective was the regulatory response?',
                'What changes in liquidity regulation resulted from this crisis?'
            ]
        });

        // Add interactive quizzes
        this.addQuiz({
            id: 'uk-reg-basics-quiz',
            title: 'UK Banking Regulation Basics',
            questions: [
                {
                    id: 'q1',
                    type: 'multiple-choice',
                    question: 'Which body is responsible for prudential regulation of UK banks?',
                    options: [
                        'Financial Conduct Authority (FCA)',
                        'Prudential Regulation Authority (PRA)',
                        'Bank of England (BoE)',
                        'HM Treasury'
                    ],
                    correct: 1,
                    explanation: 'The PRA is responsible for prudential regulation of banks, building societies, credit unions, insurers, and major investment firms.'
                },
                {
                    id: 'q2',
                    type: 'multiple-choice',
                    question: 'What is the minimum Common Equity Tier 1 (CET1) ratio under Basel III?',
                    options: ['3%', '4.5%', '6%', '8%'],
                    correct: 1,
                    explanation: 'The minimum CET1 ratio is 4.5% of risk-weighted assets under Basel III.'
                }
            ]
        });

        // Add educational articles
        this.addArticle({
            id: 'pra-stress-testing-guide',
            title: 'Understanding PRA Stress Testing',
            category: 'Risk Management',
            author: 'UK Banking Law Team',
            date: '2024-01-15',
            content: `
                <h3>PRA Stress Testing Framework</h3>
                <p>The PRA conducts annual stress tests to assess the resilience of the UK banking system...</p>
            `,
            tags: ['stress-testing', 'pra', 'capital-planning']
        });

        this.buildSearchIndex();
        console.log('✅ Learning database initialized with comprehensive educational content');
    }

    // Add course to database
    addCourse(course) {
        this.coursesDatabase.set(course.id, course);
    }

    // Add case study to database
    addCaseStudy(caseStudy) {
        this.casesDatabase.set(caseStudy.id, caseStudy);
    }

    // Add quiz to database
    addQuiz(quiz) {
        this.quizzesDatabase.set(quiz.id, quiz);
    }

    // Add article to database
    addArticle(article) {
        this.articlesDatabase.set(article.id, article);
    }

    // Build search index
    buildSearchIndex() {
        // Index courses
        this.coursesDatabase.forEach(course => {
            this.indexContent('course', course.id, course.title, course.category);
            course.modules.forEach(module => {
                this.indexContent('module', module.id, module.title, course.category);
            });
        });

        // Index case studies
        this.casesDatabase.forEach(caseStudy => {
            this.indexContent('case', caseStudy.id, caseStudy.title, caseStudy.category);
        });

        // Index articles
        this.articlesDatabase.forEach(article => {
            this.indexContent('article', article.id, article.title, article.category);
        });
    }

    // Index content for search
    indexContent(type, id, title, category) {
        const words = title.toLowerCase().split(' ');
        words.forEach(word => {
            if (!this.searchIndex.has(word)) {
                this.searchIndex.set(word, []);
            }
            this.searchIndex.get(word).push({ type, id, title, category });
        });
    }

    // Search learning content
    searchContent(query) {
        const results = [];
        const queryWords = query.toLowerCase().split(' ');
        
        queryWords.forEach(word => {
            if (this.searchIndex.has(word)) {
                results.push(...this.searchIndex.get(word));
            }
        });

        // Remove duplicates and sort by relevance
        const uniqueResults = Array.from(
            new Map(results.map(item => [item.id, item])).values()
        );

        return uniqueResults.slice(0, 10);
    }

    // Get course by ID
    getCourse(courseId) {
        return this.coursesDatabase.get(courseId);
    }

    // Get case study by ID
    getCaseStudy(caseId) {
        return this.casesDatabase.get(caseId);
    }

    // Get all courses by category
    getCoursesByCategory(category) {
        return Array.from(this.coursesDatabase.values())
            .filter(course => course.category === category);
    }

    // Get user progress
    getUserProgress(userId) {
        return this.userProgress.get(userId) || {
            completed_courses: [],
            completed_modules: [],
            quiz_scores: {},
            certificates: []
        };
    }

    // Update user progress
    updateProgress(userId, progressUpdate) {
        const currentProgress = this.getUserProgress(userId);
        const updatedProgress = { ...currentProgress, ...progressUpdate };
        this.userProgress.set(userId, updatedProgress);
        return updatedProgress;
    }

    // Complete module
    completeModule(userId, courseId, moduleId) {
        const progress = this.getUserProgress(userId);
        
        if (!progress.completed_modules.includes(moduleId)) {
            progress.completed_modules.push(moduleId);
        }

        // Check if course is complete
        const course = this.getCourse(courseId);
        if (course) {
            const allModulesComplete = course.modules.every(module => 
                progress.completed_modules.includes(module.id)
            );
            
            if (allModulesComplete && !progress.completed_courses.includes(courseId)) {
                progress.completed_courses.push(courseId);
                progress.certificates.push({
                    course_id: courseId,
                    course_title: course.title,
                    completed_date: new Date().toISOString(),
                    certificate_id: `cert-${courseId}-${Date.now()}`
                });
            }
        }

        this.userProgress.set(userId, progress);
        return progress;
    }

    // Submit quiz
    submitQuiz(userId, quizId, answers) {
        const quiz = this.quizzesDatabase.get(quizId);
        if (!quiz) return null;

        let score = 0;
        const results = quiz.questions.map((question, index) => {
            const userAnswer = answers[index];
            const correct = userAnswer === question.correct;
            if (correct) score++;

            return {
                question_id: question.id,
                question: question.question,
                user_answer: question.options[userAnswer] || 'No answer',
                correct_answer: question.options[question.correct],
                is_correct: correct,
                explanation: question.explanation
            };
        });

        const progress = this.getUserProgress(userId);
        progress.quiz_scores[quizId] = {
            score: score,
            total: quiz.questions.length,
            percentage: Math.round((score / quiz.questions.length) * 100),
            completed_date: new Date().toISOString(),
            results: results
        };

        this.userProgress.set(userId, progress);
        return progress.quiz_scores[quizId];
    }

    // Get learning recommendations
    getRecommendations(userId) {
        const progress = this.getUserProgress(userId);
        const recommendations = [];

        // Recommend courses based on completed ones
        if (progress.completed_courses.length === 0) {
            recommendations.push({
                type: 'course',
                id: 'uk-banking-regulation-fundamentals',
                title: 'Start with UK Banking Regulation Fundamentals',
                reason: 'Perfect introduction to UK banking law'
            });
        }

        // Recommend related case studies
        progress.completed_courses.forEach(courseId => {
            const course = this.getCourse(courseId);
            if (course && course.case_studies) {
                course.case_studies.forEach(caseId => {
                    recommendations.push({
                        type: 'case',
                        id: caseId,
                        title: this.getCaseStudy(caseId)?.title,
                        reason: `Related to completed course: ${course.title}`
                    });
                });
            }
        });

        return recommendations.slice(0, 5);
    }

    // Generate learning path
    generateLearningPath(userLevel, interests) {
        const path = [];

        if (userLevel === 'beginner') {
            path.push('uk-banking-regulation-fundamentals');
        }

        if (interests.includes('consumer-protection')) {
            path.push('consumer-duty-implementation');
        }

        return path.map(courseId => this.getCourse(courseId)).filter(Boolean);
    }

    // Export learning data
    exportLearningData(format = 'json') {
        const data = {
            courses: Array.from(this.coursesDatabase.values()),
            case_studies: Array.from(this.casesDatabase.values()),
            articles: Array.from(this.articlesDatabase.values()),
            quizzes: Array.from(this.quizzesDatabase.values()),
            generated: new Date().toISOString()
        };

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            default:
                return data;
        }
    }

    // Get learning analytics
    getLearningAnalytics() {
        return {
            total_courses: this.coursesDatabase.size,
            total_case_studies: this.casesDatabase.size,
            total_articles: this.articlesDatabase.size,
            total_quizzes: this.quizzesDatabase.size,
            active_users: this.userProgress.size,
            popular_courses: this.getPopularCourses(),
            completion_rates: this.getCompletionRates()
        };
    }

    // Get popular courses
    getPopularCourses() {
        const courseCounts = new Map();
        
        this.userProgress.forEach(progress => {
            progress.completed_courses.forEach(courseId => {
                courseCounts.set(courseId, (courseCounts.get(courseId) || 0) + 1);
            });
        });

        return Array.from(courseCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([courseId, count]) => ({
                course: this.getCourse(courseId),
                completions: count
            }));
    }

    // Get completion rates
    getCompletionRates() {
        const rates = {};
        
        this.coursesDatabase.forEach(course => {
            let started = 0;
            let completed = 0;
            
            this.userProgress.forEach(progress => {
                const hasStarted = course.modules.some(module => 
                    progress.completed_modules.includes(module.id)
                );
                if (hasStarted) started++;
                
                if (progress.completed_courses.includes(course.id)) {
                    completed++;
                }
            });
            
            rates[course.id] = {
                title: course.title,
                started: started,
                completed: completed,
                completion_rate: started > 0 ? Math.round((completed / started) * 100) : 0
            };
        });

        return rates;
    }
}

// Export for use in main application
window.LearningDatabase = LearningDatabase;

// Initialize learning database
const learningDatabase = new LearningDatabase();

console.log('📚 Interactive Learning and Case Database loaded');