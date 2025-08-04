import React, { useState } from 'react';

interface FormStep {
  id: string;
  title: string;
  description: string;
}

interface CaseDetails {
  caseType: string;
  urgency: string;
  description: string;
  timeline: string;
  documents: File[];
  budget: string;
  preferredContact: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
}

const IntakeForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CaseDetails>({
    caseType: '',
    urgency: '',
    description: '',
    timeline: '',
    documents: [],
    budget: '',
    preferredContact: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    }
  });

  const steps: FormStep[] = [
    {
      id: 'case-type',
      title: 'Case Type',
      description: 'What type of legal issue do you need help with?'
    },
    {
      id: 'case-details',
      title: 'Case Details',
      description: 'Tell us more about your situation'
    },
    {
      id: 'documents',
      title: 'Supporting Documents',
      description: 'Upload any relevant documents (optional)'
    },
    {
      id: 'timeline-budget',
      title: 'Timeline & Budget',
      description: 'When do you need this resolved and what\'s your budget?'
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'How can we reach you?'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your submission before sending'
    }
  ];

  const caseTypes = [
    { id: 'contract', name: 'Contract Disputes', icon: '📄', urgentByDefault: false },
    { id: 'debt', name: 'Debt Recovery', icon: '💷', urgentByDefault: true },
    { id: 'employment', name: 'Employment Issues', icon: '👥', urgentByDefault: true },
    { id: 'consumer', name: 'Consumer Rights', icon: '🛡️', urgentByDefault: false },
    { id: 'company', name: 'Company Disputes', icon: '🏢', urgentByDefault: true },
    { id: 'mediation', name: 'Commercial Mediation', icon: '🤝', urgentByDefault: false },
    { id: 'other', name: 'Other Legal Matter', icon: '⚖️', urgentByDefault: false }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Your claim has been submitted! We\'ll contact you within 24 hours.');
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData({
        ...formData,
        documents: [...formData.documents, ...Array.from(files)]
      });
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocuments });
  };

  const getProgressPercentage = () => {
    return Math.round(((currentStep + 1) / steps.length) * 100);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'case-type':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ 
                    ...formData, 
                    caseType: type.id,
                    urgency: type.urgentByDefault ? 'urgent' : 'standard'
                  })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.caseType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{type.name}</div>
                      {type.urgentByDefault && (
                        <div className="text-xs text-orange-600 font-medium">Usually urgent</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'case-details':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How urgent is this matter?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'standard', name: 'Standard', desc: 'Can wait 1-2 weeks', color: 'green' },
                  { id: 'urgent', name: 'Urgent', desc: 'Need action within days', color: 'orange' },
                  { id: 'emergency', name: 'Emergency', desc: 'Need immediate action', color: 'red' }
                ].map((urgency) => (
                  <button
                    key={urgency.id}
                    onClick={() => setFormData({ ...formData, urgency: urgency.id })}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.urgency === urgency.id
                        ? `border-${urgency.color}-500 bg-${urgency.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{urgency.name}</div>
                    <div className="text-xs text-gray-600">{urgency.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your legal issue *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide as much detail as possible about your situation, including key dates, parties involved, and what outcome you're seeking..."
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.description.length}/2000 characters
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Supporting Documents (Optional)
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="text-4xl mb-4">📎</div>
                <div className="text-gray-600 mb-2">
                  Drag and drop files here, or{' '}
                  <label className="text-blue-600 cursor-pointer hover:text-blue-800">
                    browse files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                  </label>
                </div>
                <div className="text-xs text-gray-500">
                  PDF, Word, Images, Text files up to 10MB each
                </div>
              </div>
            </div>

            {formData.documents.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm">📄</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'timeline-budget':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When do you need this resolved?
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select timeline</option>
                <option value="immediate">Immediately (within 1 week)</option>
                <option value="urgent">Urgent (within 1 month)</option>
                <option value="standard">Standard (within 3 months)</option>
                <option value="flexible">Flexible (no specific deadline)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your budget range?
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select budget range</option>
                <option value="under-1000">Under £1,000</option>
                <option value="1000-5000">£1,000 - £5,000</option>
                <option value="5000-10000">£5,000 - £10,000</option>
                <option value="10000-25000">£10,000 - £25,000</option>
                <option value="over-25000">Over £25,000</option>
                <option value="no-win-no-fee">No win, no fee preferred</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Pricing Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Free initial 15-minute consultation</li>
                <li>• Transparent fixed fees for simple matters</li>
                <li>• No win, no fee available for many cases</li>
                <li>• Detailed cost estimate provided within 24 hours</li>
              </ul>
            </div>
          </div>
        );

      case 'contact-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.company}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, company: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'email', name: 'Email', icon: '📧' },
                  { id: 'phone', name: 'Phone', icon: '📞' },
                  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setFormData({ ...formData, preferredContact: method.id })}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.preferredContact === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{method.icon}</div>
                    <div className="text-sm font-medium">{method.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Review Your Submission</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-700">Case Type:</span>
                  <span className="ml-2 text-gray-900">
                    {caseTypes.find(t => t.id === formData.caseType)?.name}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Urgency:</span>
                  <span className="ml-2 text-gray-900 capitalize">{formData.urgency}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="mt-1 text-gray-900 text-sm">{formData.description}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Timeline:</span>
                  <span className="ml-2 text-gray-900">{formData.timeline}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Budget:</span>
                  <span className="ml-2 text-gray-900">{formData.budget}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="ml-2 text-gray-900">
                    {formData.contactInfo.name} ({formData.contactInfo.email})
                  </span>
                </div>
                
                {formData.documents.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Documents:</span>
                    <span className="ml-2 text-gray-900">
                      {formData.documents.length} file(s) uploaded
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">✅ What happens next?</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• We'll review your case within 2 hours</li>
                <li>• You'll receive a call or email within 24 hours</li>
                <li>• Free 15-minute consultation to discuss options</li>
                <li>• Clear fee estimate with no hidden costs</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Start Your Legal Claim</h2>
          <div className="text-sm">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="bg-blue-500 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="text-gray-600">
            {steps[currentStep].description}
          </p>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStep === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          ← Previous
        </button>

        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Submit Claim →
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default IntakeForm;