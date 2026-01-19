import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function ROIMap() {
  const [data, setData] = useState([]);
  const [regionFilter, setRegionFilter] = useState('All');
  const [spillFilter, setSpillFilter] = useState(0);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/all`);
      setData(response.data);
      
      // Extract unique regions
      const uniqueRegions = ['All', ...new Set(response.data.map(item => item.Region))];
      setRegions(uniqueRegions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getMarkerColor = (roiLevel) => {
    switch (roiLevel) {
      case 'Very High':
        return 'darkred';
      case 'High':
        return 'red';
      case 'Medium':
        return 'orange';
      case 'Low':
        return 'green';
      default:
        return 'blue';
    }
  };

  const filteredData = data.filter(item => {
    const matchesRegion = regionFilter === 'All' || item.Region === regionFilter;
    const matchesSpill = item.Spill_Count >= spillFilter;
    return matchesRegion && matchesSpill;
  });

  return (
    <div className="roi-container">
      <h2>🗺️ ROI Visualization</h2>

      <div className="roi-grid">
        {/* Filters Panel */}
        <div className="filter-panel">
          <h3>Map Filters</h3>
          
          <div className="filter-group">
            <label>Filter by Region:</label>
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              className="filter-select"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Minimum Spill Count: {spillFilter}</label>
            <input
              type="range"
              min="0"
              max="20"
              value={spillFilter}
              onChange={(e) => setSpillFilter(Number(e.target.value))}
              className="filter-slider"
            />
          </div>

          <hr />

          <div className="legend">
            <h4>Legend:</h4>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: 'darkred'}}></span>
              <span>Very High Risk</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: 'red'}}></span>
              <span>High Risk</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: 'orange'}}></span>
              <span>Medium Risk</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: 'green'}}></span>
              <span>Low Risk</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="map-panel">
          <h3>Oil Spill Map</h3>
          {filteredData.length > 0 ? (
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredData.map((item, index) => (
                <CircleMarker
                  key={index}
                  center={[item.Lat, item.Lon]}
                  radius={item.Spill_Count * 2}
                  fillColor={getMarkerColor(item.ROI_Level)}
                  color={getMarkerColor(item.ROI_Level)}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.6}
                >
                  <Popup>
                    <strong>Region:</strong> {item.Region}<br />
                    <strong>Spill Count:</strong> {item.Spill_Count}<br />
                    <strong>ROI Level:</strong> {item.ROI_Level}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          ) : (
            <p>No data available for the selected filters</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ROIMap;