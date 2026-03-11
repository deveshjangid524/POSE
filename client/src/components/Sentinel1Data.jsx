import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import API from '../utils/api';

function Sentinel1Data() {
  const [sentinelData, setSentinelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchSentinel1Data = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/api/sentinel1/latest');
      setSentinelData(response.data);
      console.log('Sentinel-1 data fetched:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Sentinel-1 data');
      console.error('Error fetching Sentinel-1 data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPolarizationColor = (polarization) => {
    const colors = {
      'VV': '#1f77b4',
      'VH': '#ff7f0e',
      'HH': '#2ca02c',
      'HV': '#d62728'
    };
    return colors[polarization] || '#333';
  };

  const analyzeOilSpillPotential = (image) => {
    const properties = image.properties || {};
    const polarization = properties.polarization || '';
    const instrumentMode = properties.instrumentMode || '';
    
    // Basic oil spill detection criteria
    let confidence = 0;
    let reasons = [];
    
    // VV polarization is better for oil spill detection
    if (polarization.includes('VV')) {
      confidence += 30;
      reasons.push('VV polarization present');
    }
    
    // IW mode is optimal for oil spill monitoring
    if (instrumentMode === 'IW') {
      confidence += 25;
      reasons.push('Interferometric Wide mode');
    }
    
    // Descending orbit often provides better oil spill visibility
    if (properties.orbitProperties_pass === 'DESCENDING') {
      confidence += 20;
      reasons.push('Descending orbit pass');
    }
    
    return {
      confidence,
      reasons,
      level: confidence > 50 ? 'High' : confidence > 25 ? 'Medium' : 'Low'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">🛰️ Sentinel-1 SAR Data</h2>
          <p className="text-gray-600">Real-time satellite data for oil spill detection</p>
        </div>

        {/* Fetch Button */}
        <div className="text-center mb-8">
          <button
            onClick={fetchSentinel1Data}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄 Fetching Data...' : '📡 Fetch Latest Sentinel-1 Data'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Data Display */}
        {sentinelData && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {sentinelData.first_5_images?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Images Retrieved</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(sentinelData.first_5_images?.map(img => img.properties?.polarization)).size}
                </div>
                <div className="text-sm text-gray-600">Polarizations</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(sentinelData.first_5_images?.map(img => img.properties?.instrumentMode)).size}
                </div>
                <div className="text-sm text-gray-600">Instrument Modes</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">SAR</div>
                <div className="text-sm text-gray-600">Radar Imaging</div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">📊</span>
                Latest Sentinel-1 Scenes
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scene ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Polarization</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orbit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oil Spill Potential</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sentinelData.first_5_images?.map((image, index) => {
                      const analysis = analyzeOilSpillPotential(image);
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {image.id?.split('/').pop() || `Scene ${index + 1}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {image.properties?.system_time_start?.split('T')[0] || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: getPolarizationColor(image.properties?.polarization) + '20',
                                color: getPolarizationColor(image.properties?.polarization)
                              }}
                            >
                              {image.properties?.polarization || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {image.properties?.instrumentMode || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {image.properties?.orbitProperties_pass || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                analysis.level === 'High' ? 'bg-red-500' : 
                                analysis.level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <span className={`text-xs font-medium ${
                                analysis.level === 'High' ? 'text-red-700' : 
                                analysis.level === 'Medium' ? 'text-yellow-700' : 'text-green-700'
                              }`}>
                                {analysis.level} ({analysis.confidence}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedImage(image)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Image Details Modal */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Scene Details</h3>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <strong>Scene ID:</strong> {selectedImage.id}
                    </div>
                    <div>
                      <strong>Acquisition Date:</strong> {selectedImage.properties?.system_time_start}
                    </div>
                    <div>
                      <strong>Polarization:</strong> {selectedImage.properties?.polarization}
                    </div>
                    <div>
                      <strong>Instrument Mode:</strong> {selectedImage.properties?.instrumentMode}
                    </div>
                    <div>
                      <strong>Orbit Direction:</strong> {selectedImage.properties?.orbitProperties_pass}
                    </div>
                    <div>
                      <strong>Available Bands:</strong> {selectedImage.bands?.join(', ') || 'N/A'}
                    </div>
                    
                    <div>
                      <strong>Oil Spill Analysis:</strong>
                      <div className="mt-2">
                        {analyzeOilSpillPotential(selectedImage).reasons.map((reason, idx) => (
                          <div key={idx} className="text-sm text-gray-600">• {reason}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!sentinelData && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🛰️</div>
            <p className="text-gray-500 text-lg mb-2">No Sentinel-1 data loaded</p>
            <p className="text-gray-400 text-sm">Click the button above to fetch the latest satellite data</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sentinel1Data;
