// JuriBank Personalized Dashboard System - TypeScript Interfaces
// Enterprise-grade type definitions for scalable dashboard architecture

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier: 'free' | 'premium' | 'enterprise';
  dashboardPreferences: DashboardPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profilePicture?: string;
  timezone: string;
  language: string;
}

export interface DashboardPreferences {
  theme: 'light' | 'dark' | 'auto';
  layout: 'grid' | 'list' | 'compact';
  notifications: NotificationPreferences;
  widgets: WidgetPreferences[];
  defaultView: 'overview' | 'cases' | 'documents' | 'analytics';
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  categories: string[];
}

export interface WidgetPreferences {
  id: string;
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface Case {
  id: string;
  userId: string;
  title: string;
  status: CaseStatus;
  category: CaseCategory;
  priority: CasePriority;
  description: string;
  successProbability: number;
  estimatedResolution: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  tags: string[];
  metadata: CaseMetadata;
}

export type CaseStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'in_progress' 
  | 'awaiting_response' 
  | 'resolved' 
  | 'closed' 
  | 'cancelled';

export type CaseCategory = 
  | 'banking_dispute' 
  | 'payment_issue' 
  | 'loan_problem' 
  | 'insurance_claim' 
  | 'investment_complaint' 
  | 'mortgage_dispute' 
  | 'credit_card_issue' 
  | 'other';

export type CasePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CaseMetadata {
  amount?: number;
  currency?: string;
  institutionName?: string;
  referenceNumber?: string;
  dateOfIncident?: Date;
  relatedCases?: string[];
}

export interface Milestone {
  id: string;
  caseId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate: Date;
  completedAt?: Date;
  orderIndex: number;
  requirements: string[];
  documents: Document[];
  estimatedDuration: number; // in days
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'skipped';

export interface Document {
  id: string;
  userId: string;
  caseId?: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  version: number;
  tags: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  sharedWith: string[];
  checksum: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  parentId?: string;
  path: string;
  documents: Document[];
  subfolders: Folder[];
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  resourceId: string;
  resourceType: 'document' | 'folder' | 'case';
  userId: string;
  permissionType: 'read' | 'write' | 'admin';
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface Recommendation {
  id: string;
  userId: string;
  caseId?: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: number;
  confidence: number;
  reasoning: string[];
  actionItems: ActionItem[];
  similarCases: SimilarCase[];
  isRead: boolean;
  isDismissed: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export type RecommendationType = 
  | 'next_step' 
  | 'document_needed' 
  | 'deadline_reminder' 
  | 'strategy_suggestion' 
  | 'risk_alert' 
  | 'success_opportunity';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  url?: string;
  completed: boolean;
}

export interface SimilarCase {
  id: string;
  title: string;
  category: CaseCategory;
  successRate: number;
  averageResolutionTime: number;
  commonFactors: string[];
  outcome: string;
  lessons: string[];
}

export interface UserAnalytics {
  id: string;
  userId: string;
  eventType: AnalyticsEventType;
  eventData: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

export type AnalyticsEventType = 
  | 'login' 
  | 'logout' 
  | 'case_created' 
  | 'case_updated' 
  | 'document_uploaded' 
  | 'milestone_completed' 
  | 'recommendation_viewed' 
  | 'dashboard_viewed' 
  | 'search_performed';

export interface UserMetrics {
  userId: string;
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  successRate: number;
  averageResolutionTime: number;
  documentsUploaded: number;
  milestonesCompleted: number;
  recommendationsFollowed: number;
  lastActivityDate: Date;
  engagementScore: number;
}

export interface Benchmark {
  category: string;
  metric: string;
  userValue: number;
  averageValue: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface Prediction {
  id: string;
  type: 'success_probability' | 'resolution_time' | 'next_milestone';
  value: number;
  confidence: number;
  factors: string[];
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
}

export type NotificationType = 
  | 'milestone_due' 
  | 'document_required' 
  | 'case_update' 
  | 'recommendation' 
  | 'system_alert' 
  | 'achievement_unlocked';

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt: Date;
  requirements: AchievementRequirement[];
}

export type AchievementType = 
  | 'first_case' 
  | 'milestone_master' 
  | 'document_organizer' 
  | 'quick_resolver' 
  | 'community_helper' 
  | 'knowledge_seeker';

export interface AchievementRequirement {
  type: string;
  target: number;
  current: number;
  completed: boolean;
}

// Dashboard Component Props Interfaces
export interface DashboardProps {
  user: User;
  initialData?: DashboardData;
}

export interface DashboardData {
  overview: DashboardOverview;
  cases: Case[];
  recentActivity: Activity[];
  notifications: Notification[];
  recommendations: Recommendation[];
  metrics: UserMetrics;
}

export interface DashboardOverview {
  activeCases: number;
  pendingTasks: number;
  documentsToReview: number;
  upcomingDeadlines: number;
  successRate: number;
  avgResolutionTime: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  caseId?: string;
  userId: string;
  metadata: Record<string, any>;
}

export interface CommandCenterProps {
  userId: string;
  cases: Case[];
  notifications: Notification[];
  quickActions: QuickAction[];
  metrics: UserMetrics;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  url: string;
  priority: number;
  category: string;
}

export interface ProgressTimelineProps {
  caseId: string;
  milestones: Milestone[];
  currentProgress: number;
  estimatedCompletion: Date;
  showPredictions?: boolean;
}

export interface SmartRecommendationsProps {
  userId: string;
  caseData?: Case;
  userHistory: UserAnalytics[];
  similarCases: SimilarCase[];
  recommendations: Recommendation[];
}

export interface DocumentLibraryProps {
  userId: string;
  documents: Document[];
  folders: Folder[];
  permissions: Permission[];
  searchQuery?: string;
  selectedTags?: string[];
}

export interface AnalyticsDashboardProps {
  userId: string;
  metrics: UserMetrics;
  benchmarks: Benchmark[];
  predictions: Prediction[];
  timeRange: 'week' | 'month' | 'quarter' | 'year';
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationInfo;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// WebSocket Event Interfaces
export interface WebSocketEvent<T = any> {
  type: string;
  data: T;
  timestamp: Date;
  userId: string;
}

export interface DashboardUpdateEvent {
  type: 'dashboard:update';
  data: Partial<DashboardData>;
}

export interface CaseProgressEvent {
  type: 'case:progress';
  data: {
    caseId: string;
    milestone: Milestone;
    progressPercentage: number;
  };
}

export interface NotificationEvent {
  type: 'notification:new';
  data: Notification;
}

export interface RecommendationEvent {
  type: 'recommendation:new';
  data: Recommendation;
}

// Configuration Interfaces
export interface DashboardConfig {
  apiBaseUrl: string;
  wsUrl: string;
  refreshInterval: number;
  cacheTimeout: number;
  maxFileSize: number;
  supportedFileTypes: string[];
  features: FeatureFlags;
}

export interface FeatureFlags {
  realTimeUpdates: boolean;
  aiRecommendations: boolean;
  documentPreview: boolean;
  advancedAnalytics: boolean;
  communityFeatures: boolean;
  mobileApp: boolean;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;