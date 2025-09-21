import React, { useState } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Phone,
  Video,
  Mail,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone' | 'emergency';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  notes: string;
  recommendations: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  attachments: Attachment[];
  vitalSigns?: VitalSigns;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
}

export default function ConsultationSystem() {
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: '1',
      patientId: '1',
      patientName: 'John Smith',
      doctorId: '1',
      doctorName: 'Dr. Johnson',
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'in-person',
      status: 'scheduled',
      priority: 'medium',
      reason: 'Follow-up on MRI results',
      notes: '',
      recommendations: [],
      followUpRequired: true,
      followUpDate: '2024-03-15',
      attachments: [],
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        oxygenSaturation: 98,
        weight: 180,
        height: 72
      }
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Sarah Johnson',
      doctorId: '1',
      doctorName: 'Dr. Johnson',
      date: '2024-01-25',
      time: '2:30 PM',
      type: 'video',
      status: 'completed',
      priority: 'high',
      reason: 'Emergency consultation - severe headaches',
      notes: 'Patient reported severe headaches and confusion. Ordered immediate CT scan. Patient shows signs of possible stroke. Referred to neurologist.',
      recommendations: [
        'Immediate CT scan',
        'Neurological consultation',
        'Monitor closely for 24 hours',
        'Start on blood thinners if CT is clear'
      ],
      followUpRequired: true,
      followUpDate: '2024-02-01',
      attachments: [
        {
          id: '1',
          name: 'CT_Scan_Results.pdf',
          type: 'pdf',
          size: 2048000,
          url: '#'
        }
      ]
    }
  ]);

  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAddingConsultation, setIsAddingConsultation] = useState(false);
  const [newConsultation, setNewConsultation] = useState<Partial<Consultation>>({});

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || consultation.status === filterStatus;
    const matchesType = filterType === 'all' || consultation.type === filterType;
    const matchesPriority = filterPriority === 'all' || consultation.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'rescheduled': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return User;
      case 'video': return Video;
      case 'phone': return Phone;
      case 'emergency': return AlertTriangle;
      default: return MessageSquare;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAddConsultation = () => {
    if (newConsultation.patientName && newConsultation.date && newConsultation.time) {
      const consultation: Consultation = {
        id: Date.now().toString(),
        patientId: newConsultation.patientId || '',
        patientName: newConsultation.patientName || '',
        doctorId: '1',
        doctorName: 'Dr. Johnson',
        date: newConsultation.date || '',
        time: newConsultation.time || '',
        type: newConsultation.type || 'in-person',
        status: 'scheduled',
        priority: newConsultation.priority || 'medium',
        reason: newConsultation.reason || '',
        notes: '',
        recommendations: [],
        followUpRequired: newConsultation.followUpRequired || false,
        followUpDate: newConsultation.followUpDate,
        attachments: [],
        vitalSigns: undefined
      };
      
      setConsultations(prev => [...prev, consultation]);
      setNewConsultation({});
      setIsAddingConsultation(false);
    }
  };

  const renderConsultationDetails = (consultation: Consultation) => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{consultation.patientName}</h2>
            <p className="text-gray-600">{consultation.type} consultation</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
              {consultation.status.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(consultation.priority)}`}>
              {consultation.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{consultation.date} at {consultation.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{consultation.doctorName}</span>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Reason for Consultation</h3>
        <p className="text-gray-700">{consultation.reason}</p>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Consultation Notes</h3>
        <textarea
          value={consultation.notes}
          onChange={(e) => {
            setConsultations(prev => prev.map(c => 
              c.id === consultation.id ? { ...c, notes: e.target.value } : c
            ));
          }}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter consultation notes..."
        />
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
        <div className="space-y-2">
          {consultation.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-900">{recommendation}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Add new recommendation..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                setConsultations(prev => prev.map(c => 
                  c.id === consultation.id 
                    ? { ...c, recommendations: [...c.recommendations, e.currentTarget.value] }
                    : c
                ));
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>

      {/* Vital Signs */}
      {consultation.vitalSigns && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{consultation.vitalSigns.bloodPressure}</div>
              <div className="text-sm text-gray-600">Blood Pressure</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{consultation.vitalSigns.heartRate} bpm</div>
              <div className="text-sm text-gray-600">Heart Rate</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{consultation.vitalSigns.temperature}°F</div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{consultation.vitalSigns.oxygenSaturation}%</div>
              <div className="text-sm text-gray-600">Oxygen Saturation</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{consultation.vitalSigns.weight} lbs</div>
              <div className="text-sm text-gray-600">Weight</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{consultation.vitalSigns.height}"</div>
              <div className="text-sm text-gray-600">Height</div>
            </div>
          </div>
        </div>
      )}

      {/* Attachments */}
      {consultation.attachments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
          <div className="space-y-2">
            {consultation.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{attachment.name}</div>
                    <div className="text-sm text-gray-600">{formatFileSize(attachment.size)}</div>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up */}
      {consultation.followUpRequired && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Calendar className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Follow-up Required</h3>
          </div>
          <p className="text-yellow-800">
            {consultation.followUpDate 
              ? `Scheduled for ${consultation.followUpDate}`
              : 'Follow-up date to be determined'
            }
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Send className="h-4 w-4" />
          <span>Save Notes</span>
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Generate Report</span>
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Consultation System</h2>
            <p className="text-gray-600">Manage patient consultations and medical notes</p>
          </div>
          <button
            onClick={() => setIsAddingConsultation(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Consultation</span>
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
                placeholder="Search consultations..."
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
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="in-person">In-Person</option>
              <option value="video">Video</option>
              <option value="phone">Phone</option>
              <option value="emergency">Emergency</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Consultations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => {
              const TypeIcon = getTypeIcon(consultation.type);
              return (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{consultation.patientName}</h4>
                        <p className="text-sm text-gray-600">{consultation.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(consultation.priority)}`}>
                        {consultation.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{consultation.date} at {consultation.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{consultation.doctorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{consultation.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {consultation.notes ? 'Notes available' : 'No notes yet'}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Consultation Modal */}
      {isAddingConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Consultation</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={newConsultation.patientName || ''}
                      onChange={(e) => setNewConsultation(prev => ({ ...prev, patientName: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newConsultation.date || ''}
                      onChange={(e) => setNewConsultation(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={newConsultation.time || ''}
                      onChange={(e) => setNewConsultation(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newConsultation.type || 'in-person'}
                      onChange={(e) => setNewConsultation(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="in-person">In-Person</option>
                      <option value="video">Video</option>
                      <option value="phone">Phone</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newConsultation.priority || 'medium'}
                      onChange={(e) => setNewConsultation(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Required</label>
                    <input
                      type="checkbox"
                      checked={newConsultation.followUpRequired || false}
                      onChange={(e) => setNewConsultation(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={newConsultation.reason || ''}
                    onChange={(e) => setNewConsultation(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setIsAddingConsultation(false);
                    setNewConsultation({});
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddConsultation}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Details Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Consultation Details</h3>
                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {renderConsultationDetails(selectedConsultation)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
