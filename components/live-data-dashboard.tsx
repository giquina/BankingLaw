/**
 * JuriBank Educational Platform - Live Data Dashboard
 * Real-time display of government and regulatory data
 * 
 * Features:
 * - Live API status indicators
 * - Real-time data updates
 * - Educational context for all data
 * - Responsive mobile-first design
 * - Accessibility compliant
 * - Error handling and fallbacks
 */

import React, { useState, useEffect, useRef } from 'react';

// Types
interface APIStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  lastUpdate: string;
  responseTime: number;
  dataFreshness: string;
}

interface LiveDataProps {
  refreshInterval?: number;
  showEducationalContext?: boolean;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface AlertData {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  publishedDate: string;
  summary: string;
  educationalContext?: string;
}

interface FinancialData {
  baseRate: {
    current: number;
    change: number;
    direction: 'up' | 'down' | 'stable';
    lastUpdate: string;
  };
  alerts: AlertData[];
  statistics: {
    complaints: number;
    upheldRate: number;
    period: string;
  };
}

// Custom hook for API data fetching
const useAPIData = (endpoint: string, refreshInterval: number = 60000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setError(null);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error?.message || 'API request failed');
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    // Set up periodic refresh
    intervalRef.current = setInterval(fetchData, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endpoint, refreshInterval]);

  return { data, loading, error, lastUpdated, refresh: fetchData };
};

// Status indicator component
const StatusIndicator: React.FC<{ status: APIStatus['status']; label: string }> = ({ 
  status, 
  label 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'outage': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'operational': return '✅';
      case 'degraded': return '⚠️';
      case 'outage': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      <span className="mr-2" aria-hidden="true">{getStatusIcon()}</span>
      <span>{label}</span>
      <span className="sr-only">Status: {status}</span>
    </div>
  );
};

// Alert card component
const AlertCard: React.FC<{ alert: AlertData; showEducational: boolean }> = ({ 
  alert, 
  showEducational 
}) => {
  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded-r-lg ${getSeverityColor()}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {alert.title}
        </h3>
        <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
          {formatDate(alert.publishedDate)}
        </span>
      </div>
      
      <p className="text-gray-700 mb-3 leading-relaxed">
        {alert.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {alert.source}
        </span>
        <span className={`inline-block text-xs px-2 py-1 rounded font-medium ${
          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {alert.severity.toUpperCase()}
        </span>
      </div>

      {showEducational && alert.educationalContext && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3 rounded">
          <div className="flex items-start">
            <span className="text-blue-400 mr-2" aria-hidden="true">💡</span>
            <div>
              <h4 className="text-blue-800 font-medium mb-1">What this means:</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                {alert.educationalContext}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Financial data widget
const FinancialDataWidget: React.FC<{ data: FinancialData; showEducational: boolean }> = ({ 
  data, 
  showEducational 
}) => {
  if (!data) return null;

  const getRateChangeIcon = () => {
    switch (data.baseRate.direction) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getRateChangeColor = () => {
    switch (data.baseRate.direction) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Key Financial Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Base Rate */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.baseRate.current}%
          </div>
          <div className={`text-sm font-medium mb-2 ${getRateChangeColor()}`}>
            <span className="mr-1">{getRateChangeIcon()}</span>
            {data.baseRate.change > 0 ? '+' : ''}{data.baseRate.change}%
          </div>
          <div className="text-xs text-gray-600">BoE Base Rate</div>
          
          {showEducational && (
            <div className="mt-3 text-xs text-gray-700 bg-blue-50 p-2 rounded">
              💡 This rate affects mortgage and savings rates across the UK
            </div>
          )}
        </div>

        {/* Active Alerts */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.alerts.length}
          </div>
          <div className="text-sm font-medium text-orange-600 mb-2">
            Active Alerts
          </div>
          <div className="text-xs text-gray-600">FCA & Gov.UK</div>
          
          {showEducational && (
            <div className="mt-3 text-xs text-gray-700 bg-blue-50 p-2 rounded">
              💡 Alerts help you stay informed about financial risks and changes
            </div>
          )}
        </div>

        {/* Ombudsman Stats */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data.statistics.upheldRate}%
          </div>
          <div className="text-sm font-medium text-blue-600 mb-2">
            Cases Upheld
          </div>
          <div className="text-xs text-gray-600">Financial Ombudsman</div>
          
          {showEducational && (
            <div className="mt-3 text-xs text-gray-700 bg-blue-50 p-2 rounded">
              💡 Success rate for consumer complaints against financial firms
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main dashboard component
const LiveDataDashboard: React.FC<LiveDataProps> = ({
  refreshInterval = 60000,
  showEducationalContext = true,
  userLevel = 'intermediate'
}) => {
  const { data: dashboardData, loading, error, lastUpdated } = useAPIData('dashboard/summary', refreshInterval);
  const { data: alertsData } = useAPIData('alerts/all', 30000); // More frequent for alerts
  const { data: healthData } = useAPIData('health', 120000); // Less frequent for health

  const [notifications, setNotifications] = useState<string[]>([]);

  // Handle new data notifications
  useEffect(() => {
    if (alertsData && alertsData.fca) {
      const criticalAlerts = alertsData.fca.filter((alert: AlertData) => alert.severity === 'critical');
      if (criticalAlerts.length > 0) {
        setNotifications(prev => [
          ...prev.slice(-4), // Keep last 4 notifications
          `${criticalAlerts.length} new critical alert(s) from FCA`
        ]);
      }
    }
  }, [alertsData]);

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Data Unavailable</div>
          <p className="text-red-700 mb-4">
            Unable to load live data. Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Financial Data Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time updates from UK government and regulatory sources
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 text-right">
          <div className="text-sm text-gray-600 mb-2">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString('en-GB') : 'Never'}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {healthData && healthData.services && Object.entries(healthData.services).map(([service, status]: [string, any]) => (
              <StatusIndicator 
                key={service}
                status={status.status}
                label={service.toUpperCase()}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-6">
          {notifications.slice(-3).map((notification, index) => (
            <div 
              key={index}
              className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-2 rounded-r animate-fade-in"
            >
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">🔔</span>
                <span className="text-blue-800">{notification}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Financial Data Widget */}
      {dashboardData && (
        <FinancialDataWidget 
          data={dashboardData} 
          showEducational={showEducationalContext} 
        />
      )}

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Regulatory Alerts</h2>
          <span className="text-sm text-gray-600">
            {alertsData ? `${(alertsData.fca || []).length + (alertsData.govuk || []).length} active` : 'Loading...'}
          </span>
        </div>

        {alertsData ? (
          <div className="max-h-96 overflow-y-auto">
            {[...(alertsData.fca || []), ...(alertsData.govuk || [])]
              .slice(0, 5)
              .map((alert: AlertData) => (
                <AlertCard 
                  key={alert.id}
                  alert={alert}
                  showEducational={showEducationalContext}
                />
              ))}
            
            {((alertsData.fca || []).length + (alertsData.govuk || []).length) === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">✅</div>
                <p>No active alerts at this time</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin text-2xl mb-2">⏳</div>
            <p className="text-gray-600">Loading alerts...</p>
          </div>
        )}
      </div>

      {/* Educational Context */}
      {showEducationalContext && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <span className="text-blue-500 text-2xl mr-3" aria-hidden="true">📚</span>
            <div>
              <h3 className="text-blue-900 font-semibold mb-2">Educational Purpose</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                This dashboard provides real-time financial data for educational purposes. 
                The information helps you understand current market conditions, regulatory changes, 
                and consumer protection measures. Always verify important information with official 
                sources and seek professional advice for personal financial decisions.
              </p>
              <div className="mt-3">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  Educational Content
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Not Financial Advice
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Data sources: Bank of England, FCA, Gov.UK, Financial Ombudsman Service
        </p>
        <p className="mt-1">
          Refresh interval: {Math.round(refreshInterval / 1000)} seconds
        </p>
      </div>
    </div>
  );
};

export default LiveDataDashboard;

// CSS for animations (would typically be in a separate CSS file)
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inject styles (in a real app, this would be handled by your CSS framework)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}