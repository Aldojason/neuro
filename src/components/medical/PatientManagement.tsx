import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  Brain, 
  Activity, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  lastVisit: string;
  nextAppointment?: string;
  riskLevel: 'low' | 'moderate' | 'high';
  status: 'active' | 'inactive' | 'critical';
  testResults: TestResult[];
  scans: Scan[];
  notes: Note[];
}

interface TestResult {
  id: string;
  type: string;
  date: string;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

interface Scan {
  id: string;
  type: 'MRI' | 'CT' | 'EEG';
  date: string;
  findings: string;
  status: 'pending' | 'completed' | 'reviewed';
}

interface Note {
  id: string;
  date: string;
  author: string;
  content: string;
  type: 'consultation' | 'observation' | 'recommendation';
}

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Smith',
      age: 65,
      gender: 'male',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
      dateOfBirth: '1959-03-15',
      emergencyContact: 'Jane Smith - +1-555-0124',
      medicalHistory: ['Hypertension', 'Diabetes Type 2', 'Previous stroke (2019)'],
      currentMedications: ['Metformin', 'Lisinopril', 'Aspirin'],
      allergies: ['Penicillin'],
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      riskLevel: 'moderate',
      status: 'active',
      testResults: [
        {
          id: '1',
          type: 'Cognitive Assessment',
          date: '2024-01-15',
          score: 78,
          riskLevel: 'moderate',
          recommendations: ['Continue monitoring', 'Cognitive exercises']
        }
      ],
      scans: [
        {
          id: '1',
          type: 'MRI',
          date: '2024-01-10',
          findings: 'Mild cortical atrophy',
          status: 'reviewed'
        }
      ],
      notes: [
        {
          id: '1',
          date: '2024-01-15',
          author: 'Dr. Johnson',
          content: 'Patient shows improvement in cognitive function. Continue current treatment plan.',
          type: 'consultation'
        }
      ]
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'tests' | 'scans' | 'notes'>('overview');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || patient.riskLevel === filterRisk;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScanIcon = (type: string) => {
    switch (type) {
      case 'MRI': return Brain;
      case 'CT': return Activity;
      case 'EEG': return Eye;
      default: return FileText;
    }
  };

  const renderPatientOverview = (patient: Patient) => (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              <p className="text-gray-600">{patient.age} years old, {patient.gender}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(patient.riskLevel)}`}>
              {patient.riskLevel.toUpperCase()} RISK
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
              {patient.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{patient.address}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Emergency Contact</h3>
            <p className="text-gray-900">{patient.emergencyContact}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{patient.testResults.length}</div>
          <div className="text-sm text-gray-600">Test Results</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">{patient.scans.length}</div>
          <div className="text-sm text-gray-600">Medical Scans</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">{patient.notes.length}</div>
          <div className="text-sm text-gray-600">Notes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">{patient.medicalHistory.length}</div>
          <div className="text-sm text-gray-600">Conditions</div>
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = (patient: Patient) => (
    <div className="space-y-6">
      {/* Medical History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
        <div className="space-y-2">
          {patient.medicalHistory.map((condition, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-900">{condition}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
        <div className="space-y-2">
          {patient.currentMedications.map((medication, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-900">{medication}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
        <div className="space-y-2">
          {patient.allergies.map((allergy, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-900">{allergy}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTestResults = (patient: Patient) => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {patient.testResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{result.type}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Date: {result.date}</div>
                  <div>Score: {result.score}/100</div>
                </div>
                <div className="mt-2">
                  <h5 className="font-medium text-gray-900 mb-1">Recommendations:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderScans = (patient: Patient) => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Medical Scans</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {patient.scans.map((scan) => {
              const Icon = getScanIcon(scan.type);
              return (
                <div key={scan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">{scan.type} Scan</h4>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      scan.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                      scan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {scan.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Date: {scan.date}</div>
                  <p className="text-sm text-gray-900">{scan.findings}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotes = (patient: Patient) => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Medical Notes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {patient.notes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{note.type.charAt(0).toUpperCase() + note.type.slice(1)} Note</h4>
                  <span className="text-sm text-gray-500">{note.date}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">By: {note.author}</div>
                <p className="text-gray-900">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
            <p className="text-gray-600">Comprehensive patient care and monitoring system</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.age} years old, {patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Patient Details - {selectedPatient.name}</h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Navigation Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'medical', label: 'Medical Info' },
                    { id: 'tests', label: 'Test Results' },
                    { id: 'scans', label: 'Scans' },
                    { id: 'notes', label: 'Notes' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && renderPatientOverview(selectedPatient)}
              {activeTab === 'medical' && renderMedicalInfo(selectedPatient)}
              {activeTab === 'tests' && renderTestResults(selectedPatient)}
              {activeTab === 'scans' && renderScans(selectedPatient)}
              {activeTab === 'notes' && renderNotes(selectedPatient)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
