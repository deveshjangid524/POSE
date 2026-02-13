import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

function SentinelFilter() {
  const [filters, setFilters] = useState({
    regions: [],
    dateRange: { start: '', end: '' },
    resolutions: ['10m', '25m', '40m'],
    polarizations: ['VV', 'VH'],
    orbit: 'both',
    incidenceAngle: [30, 40],
    cloudCover: 20
  });

  const [filteredData, setFilteredData] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(false);

  // Sample Sentinel-1 data
  const sampleSentinelData = [
    { Scene_ID: 'S1A_001', Region: 'North Atlantic', Lat: 40, Lon: -45, Polarization: 'VV', Resolution: '10m', Date: '2023-06-01' },
    { Scene_ID: 'S1A_002', Region: 'Gulf of Mexico', Lat: 25, Lon: -90, Polarization: 'VH', Resolution: '25m', Date: '2023-06-02' },
    { Scene_ID: 'S1A_003', Region: 'North Sea', Lat: 56, Lon: 3, Polarization: 'VV', Resolution: '10m', Date: '2023-06-03' },
    { Scene_ID: 'S1A_004', Region: 'Bay of Bengal', Lat: 15, Lon: 88, Polarization: 'HH', Resolution: '40m', Date: '2023-06-04' },
    { Scene_ID: 'S1A_005', Region: 'Arabian Sea', Lat: 15, Lon: 65, Polarization: 'VV', Resolution: '10m', Date: '2023-06-05' }
  ];

  const regions = [
    'North Atlantic', 'South Atlantic', 'North Pacific', 'South Pacific',
    'Indian Ocean', 'Arctic Ocean', 'Southern Ocean', 'Mediterranean Sea',
    'Caribbean Sea', 'South China Sea', 'Bay of Bengal', 'Arabian Sea',
    'Gulf of Mexico', 'North Sea', 'Baltic Sea', 'Persian Gulf'
  ];

  const handleRegionChange = (e) => {
    const value = e.target.value;
    const newRegions = filters.regions.includes(value)
      ? filters.regions.filter(r => r !== value)
      : [...filters.regions, value];
    
    setFilters({...filters, regions: newRegions});
  };

  const handleCheckboxChange = (category, value) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    setFilters({...filters, [category]: updated});
  };

  const applyFilters = () => {
    let filtered = [...sampleSentinelData];

    // Apply region filter
    if (filters.regions.length > 0) {
      filtered = filtered.filter(d => filters.regions.includes(d.Region));
    }

    // Apply resolution filter
    if (filters.resolutions.length > 0) {
      filtered = filtered.filter(d => filters.resolutions.includes(d.Resolution));
    }

    // Apply polarization filter
    if (filters.polarizations.length > 0) {
      filtered = filtered.filter(d => filters.polarizations.includes(d.Polarization));
    }

    setFilteredData(filtered);
    setAppliedFilters(true);
  };

  const resetFilters = () => {
    setFilters({
      regions: [],
      dateRange : { start: '', end: '' },
      resolutions: ['10m', '25m', '40m'],
      polarizations: ['VV', 'VH'],
      orbit: 'both',
      incidenceAngle: [30, 40],
      cloudCover: 20
    });
    setFilteredData([]);
    setAppliedFilters(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">🛰️ Sentinel-1 SAR Filter</h2>
          <p className="text-gray-600">Filter and analyze satellite data with precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">⚙️</span>
                Filter Parameters
              </h3>

              <div className="space-y-6">
                {/* Regions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Oceanic Regions</label>
                  <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                    {regions.map(region => (
                      <label key={region} className="flex items-center p-2 hover:bg-white rounded cursor-pointer transition-colors">
                        <input 
                          type="checkbox"
                          checked={filters.regions.includes(region)}
                          onChange={() => handleRegionChange({ target: { value: region } })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="date" 
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Start"
                    />
                    <input 
                      type="date" 
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="End"
                    />
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                  <div className="space-y-2">
                    {['10m', '25m', '40m'].map(res => (
                      <label key={res} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={filters.resolutions.includes(res)}
                          onChange={() => handleCheckboxChange('resolutions', res)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {res === '10m' ? '🎯 High' : res === '25m' ? '📍 Medium' : '🌍 Low'} ({res})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Polarization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Polarization</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['VV', 'VH', 'HH', 'HV'].map(pol => (
                      <label key={pol} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={filters.polarizations.includes(pol)}
                          onChange={() => handleCheckboxChange('polarizations', pol)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{pol}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cloud Cover */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Cloud Cover: <span className="text-blue-600 font-semibold">{filters.cloudCover}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.cloudCover}
                    onChange={(e) => setFilters({...filters, cloudCover: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={applyFilters} 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    🔍 Apply
                  </button>
                  <button 
                    onClick={resetFilters} 
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 text-green-600 rounded-lg p-2 mr-3">📊</span>
                Filtered Results
                {filteredData.length > 0 && (
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {filteredData.length} scenes found
                  </span>
                )}
              </h3>
              
              {filteredData.length > 0 ? (
                <div className="space-y-6">
                  {/* Map */}
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <MapContainer 
                      center={[30, 0]} 
                      zoom={2} 
                      style={{ height: '400px', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {filteredData.map((scene, index) => (
                        <CircleMarker
                          key={index}
                          center={[scene.Lat, scene.Lon]}
                          radius={8}
                          fillColor={getPolarizationColor(scene.Polarization)}
                          color={getPolarizationColor(scene.Polarization)}
                          weight={2}
                          opacity={0.8}
                          fillOpacity={0.8}
                        >
                          <Popup>
                            <div className="text-sm">
                              <div className="font-semibold mb-2">{scene.Scene_ID}</div>
                              <div><strong>Region:</strong> {scene.Region}</div>
                              <div><strong>Date:</strong> {scene.Date}</div>
                              <div><strong>Polarization:</strong> 
                                <span className={`ml-1 px-2 py-1 rounded text-xs font-medium`}
                                  style={{ 
                                    backgroundColor: getPolarizationColor(scene.Polarization) + '20',
                                    color: getPolarizationColor(scene.Polarization)
                                  }}>
                                  {scene.Polarization}
                                </span>
                              </div>
                              <div><strong>Resolution:</strong> {scene.Resolution}</div>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
                      <div className="text-sm text-gray-600">Total Scenes</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{new Set(filteredData.map(d => d.Region)).size}</div>
                      <div className="text-sm text-gray-600">Regions</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{new Set(filteredData.map(d => d.Polarization)).size}</div>
                      <div className="text-sm text-gray-600">Polarizations</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{new Set(filteredData.map(d => d.Resolution)).size}</div>
                      <div className="text-sm text-gray-600">Resolutions</div>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-800">Scene Details</h4>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scene ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pol</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Res</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredData.map((scene, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{scene.Scene_ID}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{scene.Region}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{scene.Date}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                                  style={{ 
                                    backgroundColor: getPolarizationColor(scene.Polarization) + '20',
                                    color: getPolarizationColor(scene.Polarization)
                                  }}>
                                  {scene.Polarization}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{scene.Resolution}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 opacity-50">🛰️</div>
                  <p className="text-gray-500 text-lg mb-2">No filtered data available</p>
                  <p className="text-gray-400 text-sm">Apply filters to see Sentinel-1 scenes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SentinelFilter;