import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  MessageSquare,
  User,
  Award,
  CheckCircle,
  X,
  Search,
  Filter,
  Heart
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  experience: number;
  education: string;
  languages: string[];
  availability: string;
  consultationFee: number;
  insuranceAccepted: string[];
  bio: string;
  specialties: string[];
  achievements: string[];
  patientReviews: Review[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
}

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface SuggestionCriteria {
  specialty: string;
  location: string;
  maxDistance: number;
  minRating: number;
  maxFee: number;
  availability: string;
}

export default function DoctorSuggestionSystem() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [criteria, setCriteria] = useState<SuggestionCriteria>({
    specialty: '',
    location: '',
    maxDistance: 50,
    minRating: 4.0,
    maxFee: 500,
    availability: 'any'
  });

  useEffect(() => {
    // Mock doctor data
    const mockDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Neurology',
        hospital: 'MediPredict Medical Center',
        location: 'New York, NY',
        rating: 4.9,
        experience: 15,
        education: 'MD, Harvard Medical School',
        languages: ['English', 'Spanish'],
        availability: 'Available this week',
        consultationFee: 300,
        insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna'],
        bio: 'Dr. Johnson specializes in cognitive disorders and has extensive experience in treating Alzheimer\'s and dementia patients.',
        specialties: ['Cognitive Assessment', 'Memory Disorders', 'Dementia Care'],
        achievements: ['Board Certified Neurologist', 'Published 50+ Research Papers'],
        patientReviews: [
          {
            id: '1',
            patientName: 'John D.',
            rating: 5,
            comment: 'Dr. Johnson was incredibly thorough and explained everything clearly.',
            date: '2024-01-15'
          }
        ],
        contactInfo: {
          phone: '+1-555-0101',
          email: 'sarah.johnson@medipredict.com'
        }
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Neuropsychology',
        hospital: 'City General Hospital',
        location: 'Los Angeles, CA',
        rating: 4.8,
        experience: 12,
        education: 'PhD, Stanford University',
        languages: ['English', 'Mandarin'],
        availability: 'Available next week',
        consultationFee: 250,
        insuranceAccepted: ['Blue Cross', 'Kaiser Permanente'],
        bio: 'Dr. Chen focuses on motor function disorders and has developed innovative treatment protocols for Parkinson\'s disease.',
        specialties: ['Motor Disorders', 'Parkinson\'s Disease', 'Movement Therapy'],
        achievements: ['Clinical Psychologist License', 'Award for Innovation in Treatment'],
        patientReviews: [
          {
            id: '2',
            patientName: 'Maria S.',
            rating: 5,
            comment: 'Excellent care and very knowledgeable about movement disorders.',
            date: '2024-01-10'
          }
        ],
        contactInfo: {
          phone: '+1-555-0102',
          email: 'michael.chen@citygeneral.com'
        }
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        specialty: 'Geriatric Neurology',
        hospital: 'University Medical Center',
        location: 'Chicago, IL',
        rating: 4.7,
        experience: 18,
        education: 'MD, Johns Hopkins University',
        languages: ['English', 'Spanish', 'French'],
        availability: 'Available in 2 weeks',
        consultationFee: 350,
        insuranceAccepted: ['Medicare', 'Blue Cross', 'Aetna'],
        bio: 'Dr. Rodriguez is a leading expert in age-related neurological conditions and has published extensively on geriatric care.',
        specialties: ['Geriatric Care', 'Age-Related Conditions', 'Family Counseling'],
        achievements: ['Fellowship in Geriatric Neurology', 'Author of 3 Medical Textbooks'],
        patientReviews: [
          {
            id: '3',
            patientName: 'Robert K.',
            rating: 4,
            comment: 'Very caring and understanding of elderly patients\' needs.',
            date: '2024-01-05'
          }
        ],
        contactInfo: {
          phone: '+1-555-0103',
          email: 'emily.rodriguez@universitymed.com'
        }
      }
    ];

    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  useEffect(() => {
    let filtered = doctors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by criteria
    if (criteria.specialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialty.toLowerCase().includes(criteria.specialty.toLowerCase()) ||
        doctor.specialties.some(s => s.toLowerCase().includes(criteria.specialty.toLowerCase()))
      );
    }

    if (criteria.minRating > 0) {
      filtered = filtered.filter(doctor => doctor.rating >= criteria.minRating);
    }

    if (criteria.maxFee < 1000) {
      filtered = filtered.filter(doctor => doctor.consultationFee <= criteria.maxFee);
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, criteria]);

  const handleContactDoctor = (doctor: Doctor) => {
    // In a real app, this would open a contact form or initiate communication
    alert(`Contacting ${doctor.name}...`);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    // In a real app, this would open a booking system
    alert(`Booking appointment with ${doctor.name}...`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex items-center space-x-3 mb-4">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Find the Right Doctor</h2>
            <p className="text-gray-600">AI-powered doctor recommendations based on your needs</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <select
                  value={criteria.specialty}
                  onChange={(e) => setCriteria(prev => ({ ...prev, specialty: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Specialty</option>
                  <option value="neurology">Neurology</option>
                  <option value="neuropsychology">Neuropsychology</option>
                  <option value="geriatric">Geriatric Neurology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <select
                  value={criteria.minRating}
                  onChange={(e) => setCriteria(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4.0}>4.0+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee</label>
                <select
                  value={criteria.maxFee}
                  onChange={(e) => setCriteria(prev => ({ ...prev, maxFee: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1000}>Any Fee</option>
                  <option value={200}>Under $200</option>
                  <option value={300}>Under $300</option>
                  <option value={500}>Under $500</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={criteria.availability}
                  onChange={(e) => setCriteria(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="any">Any Time</option>
                  <option value="this-week">This Week</option>
                  <option value="next-week">Next Week</option>
                  <option value="within-month">Within Month</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} matching your criteria
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-lg text-blue-600 font-medium">{doctor.specialty}</p>
                  <p className="text-gray-600">{doctor.hospital}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{doctor.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  {renderStars(doctor.rating)}
                  <span className="ml-1 text-sm font-medium text-gray-900">{doctor.rating}</span>
                </div>
                <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
                <p className="text-lg font-semibold text-gray-900">${doctor.consultationFee}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-3">{doctor.bio}</p>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{doctor.availability}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{doctor.education}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleContactDoctor(doctor)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact
                </button>
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Doctor Details</h3>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedDoctor.name}</h4>
                    <p className="text-lg text-blue-600 font-medium">{selectedDoctor.specialty}</p>
                    <p className="text-gray-600">{selectedDoctor.hospital}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">About</h5>
                    <p className="text-gray-700">{selectedDoctor.bio}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Specialties</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Achievements</h5>
                    <ul className="space-y-1">
                      {selectedDoctor.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Contact Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{selectedDoctor.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{selectedDoctor.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{selectedDoctor.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Consultation Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-medium">${selectedDoctor.consultationFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-medium">{selectedDoctor.availability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(selectedDoctor.rating)}
                          <span className="ml-1 font-medium">{selectedDoctor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Insurance Accepted</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.insuranceAccepted.map((insurance, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {insurance}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Languages</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.languages.map((language, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Reviews */}
              <div className="mt-8">
                <h5 className="font-semibold text-gray-900 mb-4">Patient Reviews</h5>
                <div className="space-y-4">
                  {selectedDoctor.patientReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.patientName}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      <p className="text-gray-500 text-xs mt-2">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => handleContactDoctor(selectedDoctor)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Doctor</span>
                </button>
                <button
                  onClick={() => handleBookAppointment(selectedDoctor)}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
