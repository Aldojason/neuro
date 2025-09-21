import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AssessmentProvider } from './contexts/AssessmentContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PatientLoginPage from './pages/PatientLoginPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import EducationPage from './pages/EducationPage';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/patient-login" element={<PatientLoginPage />} />
              <Route path="/doctor-login" element={<DoctorLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/patient-dashboard" element={
                <PrivateRoute>
                  <PatientDashboard />
                </PrivateRoute>
              } />
              <Route path="/doctor-dashboard" element={
                <PrivateRoute>
                  <DoctorDashboard />
                </PrivateRoute>
              } />
              <Route path="/assessment/:type" element={
                <PrivateRoute>
                  <AssessmentPage />
                </PrivateRoute>
              } />
              <Route path="/results/:id" element={
                <PrivateRoute>
                  <ResultsPage />
                </PrivateRoute>
              } />
              <Route path="/education" element={<EducationPage />} />
            </Routes>
          </div>
        </Router>
      </AssessmentProvider>
    </AuthProvider>
  );
}

export default App;