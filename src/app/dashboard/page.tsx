'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface ComplianceStatus {
  module: string;
  status: 'completed' | 'in_progress' | 'not_started' | 'overdue';
  score?: number;
  lastUpdated: string;
  dueDate?: string;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  category: string;
}

export default function Dashboard() {
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([
    {
      module: 'HIPAA Risk Assessment',
      status: 'in_progress',
      score: 65,
      lastUpdated: '2024-01-15',
      dueDate: '2024-02-15'
    },
    {
      module: 'Cybersecurity Assessment',
      status: 'not_started',
      lastUpdated: 'Never',
      dueDate: '2024-03-01'
    },
    {
      module: 'Quarterly Business Review',
      status: 'completed',
      score: 92,
      lastUpdated: '2024-01-10'
    }
  ]);

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Designate HIPAA Security Officer',
      description: 'Appoint a qualified individual to oversee HIPAA compliance',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-30',
      category: 'HIPAA'
    },
    {
      id: '2',
      title: 'Implement Security Training Program',
      description: 'Establish annual HIPAA security awareness training',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-02-15',
      category: 'HIPAA'
    },
    {
      id: '3',
      title: 'Review Q4 Performance Metrics',
      description: 'Analyze quarterly business performance and set Q1 goals',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-20',
      category: 'Strategic'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const overallRiskScore = 72; // This would be calculated from all assessments
  const pendingActions = actionItems.filter(item => item.status !== 'completed').length;
  const overdueActions = actionItems.filter(item => 
    item.status !== 'completed' && new Date(item.dueDate) < new Date()
  ).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to PROP.ai - Your Business Intelligence Platform</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start New Assessment
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">{overallRiskScore}/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Assessments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complianceStatus.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                <p className="text-2xl font-bold text-gray-900">{pendingActions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-2xl font-bold text-gray-900">{overdueActions}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Compliance Status</h2>
              <p className="text-sm text-gray-600">Current assessment progress and scores</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {complianceStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.module}</h3>
                      <p className="text-sm text-gray-600">
                        Last updated: {item.lastUpdated}
                        {item.dueDate && ` • Due: ${item.dueDate}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {item.score && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{item.score}/100</p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link 
                  href="/assessments"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all assessments →
                </Link>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Action Items</h2>
              <p className="text-sm text-gray-600">Priority tasks and recommendations</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {actionItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Due: {item.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link 
                  href="/action-items"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all action items →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600">Get started with common tasks</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/assessments/hipaa"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏥</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Start HIPAA Assessment</h3>
                    <p className="text-sm text-gray-600">Compliance risk evaluation</p>
                  </div>
                </div>
              </Link>

              <Link 
                href="/ai-analysis"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🤖</span>
                  <div>
                    <h3 className="font-medium text-gray-900">AI Analysis</h3>
                    <p className="text-sm text-gray-600">Get AI insights</p>
                  </div>
                </div>
              </Link>

              <Link 
                href="/reports"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Generate Report</h3>
                    <p className="text-sm text-gray-600">Compliance summary</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 