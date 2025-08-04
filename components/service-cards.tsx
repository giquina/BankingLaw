import React from 'react';

interface ServiceFeature {
  text: string;
  included: boolean;
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  pricing: {
    startingPrice: string;
    priceUnit: string;
    estimatedTime: string;
  };
  features: ServiceFeature[];
  urgency: 'standard' | 'urgent' | 'emergency';
  cta: {
    primary: string;
    secondary: string;
  };
}

const serviceData: ServiceCard[] = [
  {
    id: 'contract-disputes',
    title: 'Contract Review & Disputes',
    description: 'Expert legal review of commercial contracts and dispute resolution for breach of contract claims.',
    icon: '📄',
    pricing: {
      startingPrice: '£350',
      priceUnit: 'per hour',
      estimatedTime: '2-4 weeks'
    },
    features: [
      { text: 'Contract review and analysis', included: true },
      { text: 'Breach of contract claims', included: true },
      { text: 'Negotiation and mediation', included: true },
      { text: 'Court representation', included: true },
      { text: 'Emergency injunctions', included: false }
    ],
    urgency: 'standard',
    cta: {
      primary: 'Start Contract Review',
      secondary: 'Get Quote'
    }
  },
  {
    id: 'debt-recovery',
    title: 'Letter Before Action (Debt Recovery)',
    description: 'Professional debt recovery services including formal demand letters and legal proceedings.',
    icon: '💷',
    pricing: {
      startingPrice: '£150',
      priceUnit: 'fixed fee',
      estimatedTime: '1-2 weeks'
    },
    features: [
      { text: 'Formal demand letter', included: true },
      { text: 'Legal compliance check', included: true },
      { text: 'Debt recovery strategy', included: true },
      { text: 'Court proceedings (if needed)', included: false },
      { text: 'Asset tracing', included: false }
    ],
    urgency: 'urgent',
    cta: {
      primary: 'Send Demand Letter',
      secondary: 'Calculate Fees'
    }
  },
  {
    id: 'commercial-mediation',
    title: 'Commercial Mediation Services',
    description: 'Professional mediation for business disputes, avoiding costly court proceedings.',
    icon: '🤝',
    pricing: {
      startingPrice: '£200',
      priceUnit: 'per hour',
      estimatedTime: '1-3 days'
    },
    features: [
      { text: 'Professional mediator', included: true },
      { text: 'Neutral venue provision', included: true },
      { text: 'Settlement agreement drafting', included: true },
      { text: 'Follow-up enforcement', included: true },
      { text: 'International disputes', included: false }
    ],
    urgency: 'standard',
    cta: {
      primary: 'Book Mediation',
      secondary: 'Learn More'
    }
  },
  {
    id: 'employment-law',
    title: 'Employment Law Issues',
    description: 'Employment law support for wrongful dismissal, discrimination, and workplace disputes.',
    icon: '👥',
    pricing: {
      startingPrice: '£250',
      priceUnit: 'per hour',
      estimatedTime: '2-6 weeks'
    },
    features: [
      { text: 'Wrongful dismissal claims', included: true },
      { text: 'Discrimination cases', included: true },
      { text: 'Employment tribunal representation', included: true },
      { text: 'Settlement negotiations', included: true },
      { text: 'Senior executive disputes', included: false }
    ],
    urgency: 'urgent',
    cta: {
      primary: 'File Employment Claim',
      secondary: 'Free Assessment'
    }
  },
  {
    id: 'consumer-rights',
    title: 'Consumer Rights Protection',
    description: 'Consumer law protection for faulty goods, services, and unfair trading practices.',
    icon: '🛡️',
    pricing: {
      startingPrice: '£175',
      priceUnit: 'per hour',
      estimatedTime: '1-3 weeks'
    },
    features: [
      { text: 'Consumer rights assessment', included: true },
      { text: 'Retailer negotiations', included: true },
      { text: 'Ombudsman complaints', included: true },
      { text: 'Small claims court', included: true },
      { text: 'Class action suits', included: false }
    ],
    urgency: 'standard',
    cta: {
      primary: 'Protect My Rights',
      secondary: 'Check Eligibility'
    }
  },
  {
    id: 'company-disputes',
    title: 'Limited Company Disputes',
    description: 'Corporate law services for shareholder disputes, director issues, and company litigation.',
    icon: '🏢',
    pricing: {
      startingPrice: '£450',
      priceUnit: 'per hour',
      estimatedTime: '4-8 weeks'
    },
    features: [
      { text: 'Shareholder disputes', included: true },
      { text: 'Director duty breaches', included: true },
      { text: 'Company litigation', included: true },
      { text: 'Insolvency proceedings', included: true },
      { text: 'International subsidiaries', included: false }
    ],
    urgency: 'emergency',
    cta: {
      primary: 'Urgent Company Help',
      secondary: 'Book Consultation'
    }
  }
];

const ServiceCards: React.FC = () => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'standard': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '🚨 Emergency Service';
      case 'urgent': return '⚡ Urgent Response';
      case 'standard': return '📅 Standard Service';
      default: return 'Standard';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {serviceData.map((service) => (
        <div 
          key={service.id} 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{service.icon}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(service.urgency)}`}>
                {getUrgencyText(service.urgency)}
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {service.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Pricing */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {service.pricing.startingPrice}
              </span>
              <span className="text-sm text-gray-600">
                {service.pricing.priceUnit}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Typical resolution: {service.pricing.estimatedTime}
            </div>
          </div>

          {/* Features */}
          <div className="p-6">
            <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
            <ul className="space-y-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                    feature.included 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {feature.included ? '✓' : '−'}
                  </span>
                  <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              {service.cta.primary}
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              {service.cta.secondary}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="px-6 pb-6">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>✓ No win, no fee available</span>
              <span>✓ Free initial consultation</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCards;