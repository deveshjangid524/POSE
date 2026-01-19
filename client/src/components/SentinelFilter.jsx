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
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-lg font-medium mb-4">🛰️ Sentinel-1 SAR Data Filtering</h2>
      <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
        <h3 className="text-lg font-medium mb-2">About SAR Data Filtering</h3>
        <p>
          The Filter Data module allows selective visualization and processing of 
          Sentinel-1 SAR images based on parameters like region, acquisition date, 
          resolution, and polarization.
        </p>
        <ul>
          <li>🎯 Focus on specific oceanic regions of interest</li>
          <li>📅 Select optimal acquisition dates for analysis</li>
          <li>⚡ Choose appropriate resolution based on monitoring needs</li>
          <li>📡 Filter by polarization modes (VV, VH, HH, HV)</li>
          <li>🔍 Preview filtered dataset before processing</li>
        </ul>
      </div>

      <div className="grid grid-cols-[350px_1fr] gap-8">
        {/* Filter Parameters */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-medium mb-4">Filter Parameters</h3>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Oceanic Regions:</label>
            <select 
              multiple 
              size="6"
              onChange={handleRegionChange}
              value={filters.regions}
              className="w-full p-2 mt-2"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <small className="text-sm text-gray-600">Hold Ctrl/Cmd to select multiple</small>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Acquisition Date Range:</label>
            <input 
              type="date" 
              value={filters.dateRange.start}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
            />
            <input 
              type="date" 
              value={filters.dateRange.end}
              onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Spatial Resolution:</label>
            <label className="block mb-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.resolutions.includes('10m')}
                onChange={() => handleCheckboxChange('resolutions', '10m')}
                className="mr-2"
              />
              High Resolution (10m)
            </label>
            <label className="block mb-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.resolutions.includes('25m')}
                onChange={() => handleCheckboxChange('resolutions', '25m')}
                className="mr-2"
              />
              Medium Resolution (25m)
            </label>
            <label className="block mb-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.resolutions.includes('40m')}
                onChange={() => handleCheckboxChange('resolutions', '40m')}
                className="mr-2"
              />
              Low Resolution (40m)
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Polarization Modes:</label>
            <label className="block mb-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.polarizations.includes('VV')}
                onChange={() => handleCheckboxChange('polarizations', 'VV')}
                className="mr-2"
              />
              VV (Vertical-Vertical)
            </label>
            <label className="block mb-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.polarizations.includes('VH')}
                onChange={() => handleCheckboxChange('polarizations', 'VH')}
                className="mr-2"
              />
              VH (Vertical-Horizontal)
            </label>
            <label className="block mb-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.polarizations.includes('HH')}
                onChange={() => handleCheckboxChange('polarizations', 'HH')}
                className="mr-2"
              />
              HH (Horizontal-Horizontal)
            </label>
            <label className="block mb-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.polarizations.includes('HV')}
                onChange={() => handleCheckboxChange('polarizations', 'HV')}
                className="mr-2"
              />
              HV (Horizontal-Vertical)
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Cloud Cover: {filters.cloudCover}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.cloudCover}
              onChange={(e) => setFilters({...filters, cloudCover: Number(e.target.value)})}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={applyFilters} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              🔍 Apply Filters
            </button>
            <button onClick={resetFilters} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              🔄 Reset Filters
            </button>
          </div>

          <hr className="my-4" />

          <div className="filter-summary">
            <h4 className="text-lg font-medium mb-2">Active Filters Summary:</h4>
            <pre className="bg-gray-50 p-4 rounded text-sm">
              {appliedFilters 
                ? `Regions: ${filters.regions.length > 0 ? filters.regions.join(', ') : 'All'}\nResolutions: ${filters.resolutions.join(', ')}\nPolarizations: ${filters.polarizations.join(', ')}\nMax Cloud: ${filters.cloudCover}%`
                : 'No filters applied'
              }
            </pre>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-medium mb-4">Filtered Data Preview</h3>
          
          {filteredData.length > 0 ? (
            <>
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
                    radius={6}
                    fillColor={getPolarizationColor(scene.Polarization)}
                    color={getPolarizationColor(scene.Polarization)}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.8}
                  >
                    <Popup>
                      <strong>Scene ID:</strong> {scene.Scene_ID}<br />
                      <strong>Region:</strong> {scene.Region}<br />
                      <strong>Date:</strong> {scene.Date}<br />
                      <strong>Polarization:</strong> {scene.Polarization}<br />
                      <strong>Resolution:</strong> {scene.Resolution}
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Dataset Summary</h4>
                  <table>
                    <tbody>
                      <tr>
                        <td>Total Scenes:</td>
                        <td>{filteredData.length}</td>
                      </tr>
                      <tr>
                        <td>Regions:</td>
                        <td>{new Set(filteredData.map(d => d.Region)).size}</td>
                      </tr>
                      <tr>
                        <td>Polarizations:</td>
                        <td>{new Set(filteredData.map(d => d.Polarization)).size}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Table */}
              <div className="mt-8 overflow-x-auto">
                <h4 className="text-lg font-medium mb-2">Filtered Sentinel-1 Data</h4>
                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr>
                      <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Scene ID</th>
                      <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Region</th>
                      <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Date</th>
                      <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Polarization</th>
                      <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Resolution</th>
                      <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Lat</th>
                      <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Lon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((scene, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-left border-b border-gray-300">{scene.Scene_ID}</td>
                        <td className="p-3 text-left border-b border-gray-300">{scene.Region}</td>
                        <td className="p-3 text-left border-b border-gray-300">{scene.Date}</td>
                        <td className="p-3 text-left border-b border-gray-300">{scene.Polarization}</td>
                        <td className="p-3 text-left border-b border-gray-300">{scene.Resolution}</td>
                        <td className="p-3 text-left border-b border-gray-300">{scene.Lat}</td>
                        <td className="p-3 text-left border-b border-gray-300">{scene.Lon}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SentinelFilter;