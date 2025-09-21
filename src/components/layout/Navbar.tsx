import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Brain className="h-10 w-10 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">MediPredict</span>
                <span className="text-sm text-blue-600 font-medium">Neuro AI</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {/* Check if user is doctor or patient */}
                {user?.role === 'doctor' ? (
                  <>
                    <Link to="/doctor-dashboard" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                      Doctor Dashboard
                    </Link>
                    <Link to="/education" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                      Education
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/patient-dashboard" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                      Patient Dashboard
                    </Link>
                    <Link to="/education" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                      Education
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/education" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors">
                  Education
                </Link>
                <Link to="/patient-login" className="text-green-600 hover:text-green-800 font-medium text-lg transition-colors">
                  Patient Login
                </Link>
                <Link to="/doctor-login" className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors">
                  Doctor Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 px-4 py-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                {/* Check if user is doctor or patient */}
                {user?.role === 'doctor' ? (
                  <>
                    <Link
                      to="/doctor-dashboard"
                      className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Doctor Dashboard
                    </Link>
                    <Link
                      to="/education"
                      className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Education
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/patient-dashboard"
                      className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Patient Dashboard
                    </Link>
                    <Link
                      to="/education"
                      className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Education
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-lg font-medium text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/education"
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Education
                </Link>
                <Link
                  to="/patient-login"
                  className="block px-4 py-3 text-lg font-medium text-green-600 hover:text-green-800"
                  onClick={() => setIsOpen(false)}
                >
                  Patient Login
                </Link>
                <Link
                  to="/doctor-login"
                  className="block px-4 py-3 text-lg font-medium text-blue-600 hover:text-blue-800"
                  onClick={() => setIsOpen(false)}
                >
                  Doctor Login
                </Link>
                <Link
                  to="/register"
                  className="block mx-4 mt-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}