'use client';

import Link from "next/link";
import AIAnalysis from "../../../components/AIAnalysis";

export default function PropertyDetail() {
  // Mock property data - in a real app, this would come from an API
  const property = {
    id: 1,
    name: "Downtown Condo",
    address: "123 Main St, City, State",
    type: "Condo",
    value: 450000,
    change: "+5.2%",
    status: "Owned",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    yearBuilt: 2018,
    description: "Beautiful modern condo in the heart of downtown with stunning city views. Recently renovated with high-end finishes and appliances.",
    features: ["Balcony", "Parking", "Gym", "Pool", "Security"],
    monthlyRent: 2800,
    propertyTax: 4500,
    insurance: 1200,
    maintenance: 800
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">PROP.ai</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/properties" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-indigo-600">
                Properties
              </Link>
              <Link href="/analytics" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Analytics
              </Link>
              <div className="relative">
                <button className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  <span>John Doe</span>
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/properties" className="text-gray-500 hover:text-gray-700">
                  Properties
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">{property.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Property Image */}
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              {/* Property Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                    <p className="text-gray-600 mt-1">{property.address}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    property.status === 'Owned' ? 'bg-green-100 text-green-800' :
                    property.status === 'Rented' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">${property.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Current Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{property.change}</div>
                    <div className="text-sm text-gray-500">Value Change</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-500">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-500">Bathrooms</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{property.description}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Type</dt>
                        <dd className="font-medium">{property.type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Square Feet</dt>
                        <dd className="font-medium">{property.squareFeet.toLocaleString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Year Built</dt>
                        <dd className="font-medium">{property.yearBuilt}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Monthly Rent</dt>
                        <dd className="font-medium">${property.monthlyRent.toLocaleString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Property Tax</dt>
                        <dd className="font-medium">${property.propertyTax.toLocaleString()}/year</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Insurance</dt>
                        <dd className="font-medium">${property.insurance.toLocaleString()}/year</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Maintenance</dt>
                        <dd className="font-medium">${property.maintenance.toLocaleString()}/year</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Investment Analysis</h2>
              <p className="text-gray-600 mb-6">
                Get AI-powered investment advice and market analysis for this property.
              </p>
              
              <AIAnalysis property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 