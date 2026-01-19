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
<div className="sentinel-filter-container">
<h2>🛰️ Sentinel-1 SAR Data Filtering</h2>
  <div className="info-box">
    <h3>About SAR Data Filtering</h3>
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

  <div className="filter-grid">
    {/* Filter Parameters */}
    <div className="filter-panel">
      <h3>Filter Parameters</h3>

      <div className="form-group">
        <label>Select Oceanic Regions:</label>
        <select 
          multiple 
          size="6"
          onChange={handleRegionChange}
          value={filters.regions}
          className="multi-select"
        >
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <small>Hold Ctrl/Cmd to select multiple</small>
      </div>

      <div className="form-group">
        <label>Acquisition Date Range:</label>
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

      <div className="form-group">
        <label>Spatial Resolution:</label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filters.resolutions.includes('10m')}
            onChange={() => handleCheckboxChange('resolutions', '10m')}
          />
          High Resolution (10m)
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filters.resolutions.includes('25m')}
            onChange={() => handleCheckboxChange('resolutions', '25m')}
          />
          Medium Resolution (25m)
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filters.resolutions.includes('40m')}
            onChange={() => handleCheckboxChange('resolutions', '40m')}
          />
          Low Resolution (40m)
        </label>
      </div>

      <div className="form-group">
        <label>Polarization Modes:</label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filters.polarizations.includes('VV')}
            onChange={() => handleCheckboxChange('polarizations', 'VV')}
          />
          VV (Vertical-Vertical)
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filters.polarizations.includes('VH')}
            onChange={() => handleCheckboxChange('polarizations', 'VH')}
          />
          VH (Vertical-Horizontal)
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filters.polarizations.includes('HH')}
            onChange={() => handleCheckboxChange('polarizations', 'HH')}
          />
          HH (Horizontal-Horizontal)
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={filters.polarizations.includes('HV')}
            onChange={() => handleCheckboxChange('polarizations', 'HV')}
          />
          HV (Horizontal-Vertical)
        </label>
      </div>

      <div className="form-group">
        <label>Cloud Cover: {filters.cloudCover}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.cloudCover}
          onChange={(e) => setFilters({...filters, cloudCover: Number(e.target.value)})}
        />
      </div>

      <div className="button-group">
        <button onClick={applyFilters} className="btn btn-success">
          🔍 Apply Filters
        </button>
        <button onClick={resetFilters} className="btn btn-secondary">
          🔄 Reset Filters
        </button>
      </div>

      <hr />

      <div className="filter-summary">
        <h4>Active Filters Summary:</h4>
        <pre>
          {appliedFilters 
            ? `Regions: ${filters.regions.length > 0 ? filters.regions.join(', ') : 'All'}\nResolutions: ${filters.resolutions.join(', ')}\nPolarizations: ${filters.polarizations.join(', ')}\nMax Cloud: ${filters.cloudCover}%`
            : 'No filters applied'
          }
        </pre>
      </div>
    </div>

    {/* Preview Panel */}
    <div className="preview-panel">
      <h3>Filtered Data Preview</h3>
      
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

          <div className="summary-tables">
            <div className="summary-box">
              <h4>Dataset Summary</h4>
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
          <div className="data-table-container">
            <h4>Filtered Sentinel-1 Data</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Scene ID</th>
                  <th>Region</th>
                  <th>Date</th>
                  <th>Polarization</th>
                  <th>Resolution</th>
                  <th>Lat</th>
                  <th>Lon</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((scene, index) => (
                  <tr key={index}>
                    <td>{scene.Scene_ID}</td>
                    <td>{scene.Region}</td>
                    <td>{scene.Date}</td>
                    <td>{scene.Polarization}</td>
                    <td>{scene.Resolution}</td>
                    <td>{scene.Lat}</td>
                    <td>{scene.Lon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Apply filters to see results</p>
      )}
    </div>
  </div>
</div>
);
}
export default SentinelFilter;