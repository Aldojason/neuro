import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Brain, 
  Activity, 
  Eye, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Shield,
  Target
} from 'lucide-react';
import MedicalImagingAnalysis from '../components/medical/MedicalImagingAnalysis';
import AIInsightsComponent from '../components/ai/AIInsights';
import PatientManagement from '../components/medical/PatientManagement';
import ConsultationSystem from '../components/medical/ConsultationSystem';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  lastAssessment: string;
  riskLevel: 'low' | 'moderate' | 'high';
  status: 'active' | 'pending' | 'consultation_requested';
  scans: any[];
  assessmentResults: any[];
  consultationNotes: string[];
}

interface ConsultationRequest {
  id: string;
  patientId: string;
  patientName: string;
  requestDate: string;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
  scans: any[];
  assessmentResults: any[];
  status: 'pending' | 'in_progress' | 'completed';
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      lastAssessment: '2024-01-15',
      riskLevel: 'moderate',
      status: 'consultation_requested',
      scans: [
        { id: '1', type: 'MRI', date: '2024-01-10', findings: 'Mild cortical atrophy' },
        { id: '2', type: 'CT', date: '2024-01-12', findings: 'No acute abnormalities' }
      ],
      assessmentResults: [
        { type: 'cognitive', score: 72, riskLevel: 'moderate', date: '2024-01-15' },
        { type: 'motor', score: 85, riskLevel: 'low', date: '2024-01-15' }
      ],
      consultationNotes: []
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      age: 62,
      gender: 'Female',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0124',
      lastAssessment: '2024-01-14',
      riskLevel: 'high',
      status: 'active',
      scans: [
        { id: '3', type: 'EEG', date: '2024-01-08', findings: 'Abnormal brain wave patterns' }
      ],
      assessmentResults: [
        { type: 'cognitive', score: 58, riskLevel: 'high', date: '2024-01-14' },
        { type: 'speech', score: 65, riskLevel: 'moderate', date: '2024-01-14' }
      ],
      consultationNotes: []
    },
    {
      id: '3',
      name: 'Michael Brown',
      age: 38,
      gender: 'Male',
      email: 'michael.brown@email.com',
      phone: '+1-555-0125',
      lastAssessment: '2024-01-13',
      riskLevel: 'low',
      status: 'active',
      scans: [],
      assessmentResults: [
        { type: 'cognitive', score: 92, riskLevel: 'low', date: '2024-01-13' },
        { type: 'motor', score: 88, riskLevel: 'low', date: '2024-01-13' }
      ],
      consultationNotes: []
    }
  ]);

  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([
    {
      id: '1',
      patientId: '1',
      patientName: 'John Smith',
      requestDate: '2024-01-16',
      urgency: 'medium',
      reason: 'Patient concerned about memory issues and wants professional consultation',
      scans: [
        { id: '1', type: 'MRI', date: '2024-01-10', findings: 'Mild cortical atrophy' }
      ],
      assessmentResults: [
        { type: 'cognitive', score: 72, riskLevel: 'moderate', date: '2024-01-15' }
      ],
      status: 'pending'
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientManagement, setShowPatientManagement] = useState(false);
  const [showConsultationSystem, setShowConsultationSystem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRiskLevel === 'all' || patient.riskLevel === filterRiskLevel;
    return matchesSearch && matchesRisk;
  });

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'consultation_requested': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleConsultationStart = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowConsultationSystem(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Doctor Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Manage patients and provide neurological consultations
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPatientManagement(!showPatientManagement)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                {showPatientManagement ? 'Hide Management' : 'Patient Management'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultation Requests</p>
                <p className="text-2xl font-bold text-gray-900">{consultationRequests.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.riskLevel === 'high').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Consultations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {consultationRequests.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Management Section */}
        {showPatientManagement && (
          <div className="mb-8">
            <PatientManagement 
              patients={patients}
              onPatientSelect={setSelectedPatient}
              onConsultationStart={handleConsultationStart}
            />
          </div>
        )}

        {/* Consultation Requests */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Consultation Requests</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterRiskLevel}
                    onChange={(e) => setFilterRiskLevel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="moderate">Moderate Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              {consultationRequests.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Consultation Requests</h3>
                  <p className="text-gray-600">Patients will appear here when they request consultations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultationRequests.map((request) => {
                    const patient = patients.find(p => p.id === request.patientId);
                    return (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{request.patientName}</h3>
                            <p className="text-gray-600">Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                              request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {request.urgency.toUpperCase()} PRIORITY
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {request.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700"><strong>Reason:</strong> {request.reason}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Assessment Results</h4>
                            <div className="space-y-2">
                              {request.assessmentResults.map((result, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span className="text-sm font-medium">{result.type}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm">{result.score}/100</span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      result.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                                      result.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {result.riskLevel}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Medical Scans</h4>
                            <div className="space-y-2">
                              {request.scans.length > 0 ? (
                                request.scans.map((scan, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm font-medium">{scan.type}</span>
                                    <span className="text-sm text-gray-600">{scan.date}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No scans uploaded</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleConsultationStart(patient!)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Start Consultation
                          </button>
                          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consultation System */}
        {showConsultationSystem && selectedPatient && (
          <div className="mb-8">
            <ConsultationSystem 
              patient={selectedPatient}
              onClose={() => {
                setShowConsultationSystem(false);
                setSelectedPatient(null);
              }}
            />
          </div>
        )}

        {/* Medical Imaging Analysis */}
        <div className="mb-8">
          <MedicalImagingAnalysis />
        </div>

        {/* AI Insights for Doctor */}
        <div className="mb-8">
          <AIInsightsComponent results={patients.flatMap(p => p.assessmentResults)} />
        </div>
      </div>
    </div>
  );
}