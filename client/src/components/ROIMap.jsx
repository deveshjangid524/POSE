import React from 'react'
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
      // Ensure the response data is an array
      const dataArray = Array.isArray(response.data) ? response.data : [];
      setData(dataArray);
      
      // Extract unique regions
      const uniqueRegions = ['All', ...new Set(dataArray.map(item => item.Region))];
      setRegions(uniqueRegions);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent .map() and .filter() issues
      setData([]);
      setRegions(['All']);
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

  const filteredData = Array.isArray(data) ? data.filter(item => {
    const matchesRegion = regionFilter === 'All' || item.Region === regionFilter;
    const matchesSpill = item.Spill_Count >= spillFilter;
    return matchesRegion && matchesSpill;
  }) : [];

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-lg font-medium mb-4">🗺️ ROI Visualization</h2>

      <div className="grid grid-cols-[300px_1fr] gap-8 mt-6">
        {/* Filters Panel */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-medium mb-4">Map Filters</h3>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Filter by Region:</label>
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full p-2 mt-2 bg-slate-300"
            >
              {Array.isArray(regions) && regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Minimum Spill Count: {spillFilter}</label>
            <input
              type="range"
              min="0"
              max="20"
              value={spillFilter}
              onChange={(e) => setSpillFilter(Number(e.target.value))}
              className="w-full p-2 mt-2"
            />
          </div>

          <hr className="my-4" />

          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2">Legend:</h4>
            <div className="flex items-center mb-2">
              <span className="w-5 h-5 rounded-full mr-2" style={{backgroundColor: 'darkred'}}></span>
              <span>Very High Risk</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="w-5 h-5 rounded-full mr-2" style={{backgroundColor: 'red'}}></span>
              <span>High Risk</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="w-5 h-5 rounded-full mr-2" style={{backgroundColor: 'orange'}}></span>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="w-5 h-5 rounded-full mr-2" style={{backgroundColor: 'green'}}></span>
              <span>Low Risk</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Oil Spill Map</h3>
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
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
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