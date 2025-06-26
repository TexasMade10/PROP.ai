import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">PROP.ai</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              People, Risk, Operations & Planning
              <span className="text-blue-600"> AI-Powered</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your compliance, risk management, and strategic planning with AI-powered business intelligence. 
              Get personalized assessments, real-time insights, and actionable recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Free Assessment
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Compliance & Risk Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay compliant, manage risks, and plan strategically - all in one intelligent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* HIPAA Risk Assessment */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">HIPAA Risk Assessment</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive HIPAA compliance assessment with AI-powered analysis and personalized recommendations.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Administrative, Physical & Technical Safeguards</li>
                <li>• Real-time Risk Scoring</li>
                <li>• Actionable Improvement Plans</li>
                <li>• Regulatory Compliance Tracking</li>
              </ul>
            </div>

            {/* Cybersecurity Assessment */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cybersecurity Assessment</h3>
              <p className="text-gray-600 mb-6">
                Evaluate your cybersecurity posture with industry-standard frameworks and AI-driven insights.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• NIST Cybersecurity Framework</li>
                <li>• Threat Assessment & Analysis</li>
                <li>• Security Control Recommendations</li>
                <li>• Incident Response Planning</li>
              </ul>
            </div>

            {/* Quarterly Business Review */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quarterly Business Review</h3>
              <p className="text-gray-600 mb-6">
                Strategic planning and performance analysis with AI-powered insights and trend analysis.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Performance Metrics & KPIs</li>
                <li>• Strategic Planning Tools</li>
                <li>• Risk Trend Analysis</li>
                <li>• Goal Setting & Tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                AI-Powered Compliance Assistant
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get personalized guidance and support through our intelligent AI assistant. 
                From onboarding to ongoing compliance management, we're here to help.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">10-Minute Onboarding</h3>
                    <p className="text-gray-600">Quick setup with AI phone call to understand your business</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Personalized Assessments</h3>
                    <p className="text-gray-600">Auto-populated based on your business profile and industry</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Ongoing Support</h3>
                    <p className="text-gray-600">24/7 AI assistance for questions and guidance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AI</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">AI Assistant</p>
                    <p className="text-sm text-gray-600">Online now</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-900">
                      "Hi! I'm here to help you with your compliance journey. What would you like to know about HIPAA requirements?"
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      "I need help understanding the Security Officer requirement..."
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <input 
                    type="text" 
                    placeholder="Type your question..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Compliance Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that trust PROP.ai for their compliance, risk management, and strategic planning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <button className="border border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PROP.ai</h3>
              <p className="text-gray-400">
                AI-powered business intelligence for compliance, risk management, and strategic planning.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">HIPAA Assessment</Link></li>
                <li><Link href="#" className="hover:text-white">Cybersecurity</Link></li>
                <li><Link href="#" className="hover:text-white">Quarterly Review</Link></li>
                <li><Link href="#" className="hover:text-white">AI Assistant</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Support</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-white">Twitter</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PROP.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
