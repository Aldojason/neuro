import React, { useState, useRef, useCallback } from 'react';
import { Upload, Brain, Activity, Eye, Download, AlertTriangle, CheckCircle, FileText, Image as ImageIcon } from 'lucide-react';

interface ScanData {
  id: string;
  type: 'MRI' | 'CT' | 'EEG';
  fileName: string;
  fileSize: number;
  uploadDate: string;
  analysisResults?: AnalysisResults;
}

interface AnalysisResults {
  abnormalities: Abnormality[];
  measurements: Measurement[];
  aiInsights: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  confidence: number;
}

interface Abnormality {
  type: string;
  location: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  confidence: number;
}

interface Measurement {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'borderline';
}

export default function MedicalImagingAnalysis() {
  const [scans, setScans] = useState<ScanData[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const scanType = determineScanType(file.name);
      
      const newScan: ScanData = {
        id: Date.now().toString() + i,
        type: scanType,
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString()
      };
      
      setScans(prev => [...prev, newScan]);
      
      // Simulate AI analysis
      setTimeout(() => {
        analyzeScan(newScan.id);
      }, 2000);
    }
  };

  const determineScanType = (fileName: string): 'MRI' | 'CT' | 'EEG' => {
    const name = fileName.toLowerCase();
    if (name.includes('mri') || name.includes('magnetic')) return 'MRI';
    if (name.includes('ct') || name.includes('computed')) return 'CT';
    if (name.includes('eeg') || name.includes('electroencephalogram')) return 'EEG';
    return 'MRI'; // Default
  };

  const analyzeScan = async (scanId: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults: AnalysisResults = {
      abnormalities: [
        {
          type: 'Lesion',
          location: 'Left temporal lobe',
          severity: 'mild',
          description: 'Small hyperintense lesion detected',
          confidence: 0.85
        }
      ],
      measurements: [
        {
          name: 'Ventricular Volume',
          value: 45.2,
          unit: 'cm³',
          normalRange: '30-50 cm³',
          status: 'normal'
        },
        {
          name: 'Cortical Thickness',
          value: 2.8,
          unit: 'mm',
          normalRange: '2.5-4.0 mm',
          status: 'normal'
        }
      ],
      aiInsights: [
        'No significant structural abnormalities detected',
        'Ventricular volume within normal range',
        'Cortical thickness appears normal',
        'Recommend follow-up in 6 months'
      ],
      riskLevel: 'low',
      recommendations: [
        'Continue regular monitoring',
        'Consider follow-up scan in 6 months',
        'Monitor for any neurological symptoms',
        'Maintain healthy lifestyle habits'
      ],
      confidence: 0.92
    };
    
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { ...scan, analysisResults: mockResults }
        : scan
    ));
    
    setIsAnalyzing(false);
  };

  const getScanIcon = (type: string) => {
    switch (type) {
      case 'MRI': return Brain;
      case 'CT': return Activity;
      case 'EEG': return Eye;
      default: return ImageIcon;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Medical Imaging Analysis</h2>
            <p className="text-gray-600">AI-powered analysis of MRI, CT, and EEG scans</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <span>MRI Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-600" />
            <span>CT Scan Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-purple-600" />
            <span>EEG Analysis</span>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Medical Scans</h3>
        <p className="text-gray-600 mb-4">
          Drag and drop your MRI, CT, or EEG files here, or click to browse
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".dcm,.nii,.nii.gz,.jpg,.jpeg,.png,.pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: DICOM, NIfTI, JPG, PNG, PDF
        </p>
      </div>

      {/* Scans List */}
      {scans.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Scans</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {scans.map((scan) => {
              const Icon = getScanIcon(scan.type);
              return (
                <div
                  key={scan.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedScan?.id === scan.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedScan(scan)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{scan.fileName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{scan.type} Scan</span>
                          <span>•</span>
                          <span>{formatFileSize(scan.fileSize)}</span>
                          <span>•</span>
                          <span>{new Date(scan.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {scan.analysisResults ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Analyzed</span>
                        </div>
                      ) : isAnalyzing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-blue-600">Analyzing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm text-yellow-600">Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {selectedScan?.analysisResults && (
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedScan.analysisResults.riskLevel)}`}>
                {selectedScan.analysisResults.riskLevel.toUpperCase()} RISK
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">AI Confidence</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(selectedScan.analysisResults.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Analysis Date</div>
                <div className="text-lg font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Abnormalities */}
          {selectedScan.analysisResults.abnormalities.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">Detected Abnormalities</h3>
              </div>
              <div className="space-y-4">
                {selectedScan.analysisResults.abnormalities.map((abnormality, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-900">{abnormality.type}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        abnormality.severity === 'severe' ? 'bg-red-200 text-red-800' :
                        abnormality.severity === 'moderate' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {abnormality.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-red-800 mb-2">{abnormality.description}</p>
                    <div className="text-xs text-gray-600">
                      Location: {abnormality.location} • Confidence: {Math.round(abnormality.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Measurements */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedScan.analysisResults.measurements.map((measurement, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{measurement.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      measurement.status === 'normal' ? 'bg-green-200 text-green-800' :
                      measurement.status === 'abnormal' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {measurement.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {measurement.value} {measurement.unit}
                  </div>
                  <div className="text-sm text-gray-600">
                    Normal range: {measurement.normalRange}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">AI Insights</h3>
            </div>
            <ul className="space-y-2">
              {selectedScan.analysisResults.aiInsights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-blue-800 text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {selectedScan.analysisResults.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-green-800 text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
