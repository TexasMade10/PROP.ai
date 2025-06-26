import Link from "next/link";

export default function Properties() {
  const properties = [
    {
      id: 1,
      name: "Downtown Condo",
      address: "123 Main St, City, State",
      type: "Condo",
      value: 450000,
      change: "+5.2%",
      status: "Owned",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "Suburban House",
      address: "456 Oak Ave, Suburb, State",
      type: "Single Family",
      value: 650000,
      change: "+3.8%",
      status: "Owned",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "Beachfront Villa",
      address: "789 Coastal Dr, Beach, State",
      type: "Villa",
      value: 1200000,
      change: "+7.1%",
      status: "Owned",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      name: "Urban Apartment",
      address: "321 City Blvd, Downtown, State",
      type: "Apartment",
      value: 380000,
      change: "+4.5%",
      status: "Rented",
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      name: "Mountain Cabin",
      address: "654 Pine Rd, Mountains, State",
      type: "Cabin",
      value: 520000,
      change: "+6.2%",
      status: "Vacation Rental",
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      name: "Commercial Building",
      address: "987 Business Ave, City, State",
      type: "Commercial",
      value: 850000,
      change: "+2.9%",
      status: "Leased",
      image: "/api/placeholder/300/200"
    }
  ];

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-2">Manage your property portfolio</p>
          </div>
          <Link href="/properties/add" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Add Property
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Types</option>
                <option>Condo</option>
                <option>Single Family</option>
                <option>Apartment</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Status</option>
                <option>Owned</option>
                <option>Rented</option>
                <option>Leased</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Prices</option>
                <option>$0 - $500k</option>
                <option>$500k - $1M</option>
                <option>$1M+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Value (High to Low)</option>
                <option>Value (Low to High)</option>
                <option>Name (A-Z)</option>
                <option>Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    property.status === 'Owned' ? 'bg-green-100 text-green-800' :
                    property.status === 'Rented' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{property.address}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{property.type}</span>
                  <span className="text-sm font-medium text-green-600">{property.change}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">
                    ${property.value.toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/properties/${property.id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View
                    </Link>
                    <Link href={`/properties/${property.id}/edit`} className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 