import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickSuggestion {
  id: string;
  text: string;
  category: 'contract' | 'employment' | 'consumer' | 'debt' | 'general';
}

const LegalCompanionChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: "Hello! I'm your AI Legal Companion. I can help explain your legal rights in plain English and guide you through legal processes. What legal question can I help you with today?",
      timestamp: new Date(),
      suggestions: [
        "What are my rights as an employee?",
        "How do I make a consumer complaint?",
        "What's a contract breach?",
        "How do I recover money owed to me?"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions: QuickSuggestion[] = [
    { id: '1', text: "Explain contract terms", category: 'contract' },
    { id: '2', text: "Wrongful dismissal rights", category: 'employment' },
    { id: '3', text: "Faulty goods refund", category: 'consumer' },
    { id: '4', text: "Debt collection process", category: 'debt' },
    { id: '5', text: "Small claims court", category: 'general' },
    { id: '6', text: "Letter before action", category: 'debt' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = "";
    let suggestions: string[] = [];

    if (lowerMessage.includes('contract') || lowerMessage.includes('breach')) {
      response = "A contract breach occurs when one party fails to fulfill their obligations under a contract. You may be entitled to:\n\n• **Damages** - Money to compensate for your losses\n• **Specific performance** - Forcing them to complete the contract\n• **Termination** - Ending the contract and getting your money back\n\nThe key is proving: 1) A valid contract existed, 2) They broke it, and 3) You suffered losses as a result.";
      suggestions = [
        "What evidence do I need for breach?",
        "How much can I claim in damages?",
        "Start a contract dispute case"
      ];
    } else if (lowerMessage.includes('employment') || lowerMessage.includes('dismissal') || lowerMessage.includes('fired')) {
      response = "If you've been dismissed, you may have several rights:\n\n• **Unfair dismissal** - If dismissed without proper reason or process\n• **Wrongful dismissal** - If dismissed without proper notice\n• **Discrimination** - If dismissed due to protected characteristics\n• **Redundancy pay** - If your role was genuinely redundant\n\nYou typically have 3 months from dismissal to raise a tribunal claim. Most claims can be settled through ACAS conciliation.";
      suggestions = [
        "Calculate my redundancy pay",
        "What counts as unfair dismissal?",
        "Start an employment claim"
      ];
    } else if (lowerMessage.includes('consumer') || lowerMessage.includes('faulty') || lowerMessage.includes('goods')) {
      response = "Under the Consumer Rights Act 2015, you have strong protection:\n\n• **Right to reject** - Return faulty goods within 30 days for full refund\n• **Right to repair/replace** - Free fix or replacement within 6 months\n• **Right to price reduction** - Partial refund if repair isn't possible\n\nGoods must be of satisfactory quality, fit for purpose, and as described. Digital content and services have similar protections.";
      suggestions = [
        "How to return faulty goods?",
        "What if the shop refuses?",
        "Make a consumer complaint"
      ];
    } else if (lowerMessage.includes('debt') || lowerMessage.includes('owed') || lowerMessage.includes('money')) {
      response = "To recover money owed to you:\n\n1. **Send a formal demand** - Letter before action giving 14 days to pay\n2. **Consider mediation** - Often faster and cheaper than court\n3. **Small claims court** - For debts under £10,000\n4. **Enforcement** - If you win, bailiffs can recover the money\n\nYou have 6 years to claim most debts. Keep all evidence of the debt and any agreements.";
      suggestions = [
        "Write a letter before action",
        "How much does court cost?",
        "Start debt recovery"
      ];
    } else if (lowerMessage.includes('court') || lowerMessage.includes('claim')) {
      response = "Small claims court handles disputes up to £10,000:\n\n• **Online claims** - Most can be started online at gov.uk\n• **Court fees** - Range from £35-£770 depending on claim value\n• **No lawyers needed** - Designed for self-representation\n• **Quick process** - Usually resolved within 6 months\n\nThe losing party usually pays the winner's court fees. Consider mediation first - it's often faster and cheaper.";
      suggestions = [
        "Calculate court fees",
        "What evidence do I need?",
        "Start a court claim"
      ];
    } else {
      response = "I'm here to help with legal questions! I can explain:\n\n• **Contract disputes** - Breach of contract, terms, remedies\n• **Employment law** - Dismissal, discrimination, rights\n• **Consumer rights** - Faulty goods, services, refunds\n• **Debt recovery** - Getting money back, court process\n• **Legal procedures** - How courts work, what to expect\n\nWhat specific legal issue can I help you understand?";
      suggestions = [
        "My employment rights",
        "Consumer complaint process",
        "How to recover a debt",
        "Understanding contracts"
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      message: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    handleSendMessage();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-96 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center space-x-3">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          🤖
        </div>
        <div>
          <h3 className="font-medium">AI Legal Companion</h3>
          <p className="text-xs text-blue-100">Plain English legal guidance</p>
        </div>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <div className="text-sm whitespace-pre-line">{message.message}</div>
              <div className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages[messages.length - 1]?.suggestions && (
          <div className="flex flex-wrap gap-2">
            {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {showSuggestions && (
        <div className="px-4 pb-2">
          <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
          <div className="flex flex-wrap gap-1">
            {quickSuggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your legal rights..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>💡 I provide general guidance - not formal legal advice</span>
          <button className="text-blue-600 hover:text-blue-800">
            Book consultation →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalCompanionChat;