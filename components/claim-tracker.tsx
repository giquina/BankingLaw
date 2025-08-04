import React, { useState, useEffect } from 'react';

interface ClaimStage {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  estimatedDate?: string;
}

interface ClaimTrackerProps {
  claimId: string;
  claimType: string;
  currentStage: number;
  stages: ClaimStage[];
}

const ClaimTracker: React.FC<ClaimTrackerProps> = ({ 
  claimId, 
  claimType, 
  currentStage, 
  stages 
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(currentStage);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const getProgressPercentage = () => {
    return Math.round(((currentStage + 1) / stages.length) * 100);
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'current':
        return (
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        );
      case 'pending':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white"></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-1">Claim #{claimId}</h2>
            <p className="text-blue-100 text-sm">{claimType}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{getProgressPercentage()}%</div>
            <div className="text-xs text-blue-100">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-blue-500 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div 
              key={stage.id}
              className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all
                ${index === selectedStage ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
              `}
              onClick={() => setSelectedStage(index)}
            >
              {/* Stage Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStageIcon(stage.status)}
              </div>

              {/* Stage Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-medium ${
                      stage.status === 'current' ? 'text-blue-900' : 
                      stage.status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {stage.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      stage.status === 'current' ? 'text-blue-700' : 
                      stage.status === 'completed' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {stage.description}
                    </p>
                  </div>
                  
                  <div className="text-right text-xs text-gray-500">
                    {stage.date && (
                      <div className="font-medium text-gray-900">{stage.date}</div>
                    )}
                    {stage.estimatedDate && !stage.date && (
                      <div>Est: {stage.estimatedDate}</div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {index === selectedStage && showDetails && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Stage Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>• Next steps will be communicated within 24-48 hours</div>
                      <div>• Documents required: None at this time</div>
                      <div>• Legal team: Available for questions</div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                        Contact Team
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-50">
                        Upload Document
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className="absolute left-9 mt-8 w-0.5 h-16 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Export Timeline
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex space-x-4">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              📞 Call Legal Team
            </button>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              💬 Live Chat
            </button>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              📧 Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimTracker;