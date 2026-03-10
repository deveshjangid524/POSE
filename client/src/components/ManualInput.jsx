import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

function ManualInput() {
  const [formData, setFormData] = useState({
    region: '',
    spillCount: 0,
    roiLevel: 'Low',
    lat: 0,
    lon: 0
  });
  const [manualData, setManualData] = useState([]);

  useEffect(() => {
    fetchManualData();
  }, []);

  const fetchManualData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/manual`);
      // Ensure the response data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setManualData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty array on error to prevent .map() issues
      setManualData([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/data/manual`, {
        Region: formData.region,
        Spill_Count: parseInt(formData.spillCount),
        ROI_Level: formData.roiLevel,
        Lat: parseFloat(formData.lat),
        Lon: parseFloat(formData.lon)
      });

      // Reset form
      setFormData({
        region: '',
        spillCount: 0,
        roiLevel: 'Low',
        lat: 0,
        lon: 0
      });

      // Refresh data
      fetchManualData();
      alert('Data added successfully!');
    } catch (error) {
      console.error('Error adding data:', error);
      alert('Error adding data');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2>✏️ Manual Data Input</h2>

      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <h3 className="text-lg font-medium mb-4">Add New Data Point</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Region Name</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Enter region name"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Spill Count</label>
              <input
                type="number"
                name="spillCount"
                value={formData.spillCount}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">ROI Level</label>
              <select
                name="roiLevel"
                value={formData.roiLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Latitude</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                step="0.0001"
                min="-90"
                max="90"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Longitude</label>
              <input
                type="number"
                name="lon"
                value={formData.lon}
                onChange={handleChange}
                step="0.0001"
                min="-180"
                max="180"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              ➕ Add Data Point
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <h3 className="text-lg font-medium mb-4">Manual Data Records</h3>
          {manualData.length > 0 ? (
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Region</th>
                  <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Spill Count</th>
                  <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">ROI Level</th>
                  <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Lat</th>
                  <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Lon</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(manualData) && manualData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 text-left border-b border-gray-300">{row.Region}</td>
                    <td className="p-3 text-left border-b border-gray-300">{row.Spill_Count}</td>
                    <td className="p-3 text-left border-b border-gray-300">{row.ROI_Level}</td>
                    <td className="p-3 text-left border-b border-gray-300">{row.Lat}</td>
                    <td className="p-3 text-left border-b border-gray-300">{row.Lon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No manual data added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManualInput;