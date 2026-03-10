import React from 'react'
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function DataAnalysis() {
  const [data, setData] = useState([]);
  const [regionFilter, setRegionFilter] = useState('All');
  const [spillFilter, setSpillFilter] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/all`);
      // Ensure the response data is an array
      const dataArray = Array.isArray(response.data) ? response.data : [];
      setData(dataArray);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty array on error to prevent .map() and .filter() issues
      setData([]);
    }
  };

  const filteredData = Array.isArray(data) ? data.filter(item => {
    const matchesRegion = regionFilter === 'All' || item.Region === regionFilter;
    const matchesSpill = item.Spill_Count >= spillFilter;
    return matchesRegion && matchesSpill;
  }) : [];

  const chartData = Array.isArray(filteredData) ? filteredData.map(item => ({
    region: item.Region,
    spillCount: item.Spill_Count
  })) : [];

  const getSummaryStats = () => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) return null;

    const totalSpills = filteredData.reduce((sum, item) => sum + item.Spill_Count, 0);
    const avgSpills = (totalSpills / filteredData.length).toFixed(2);
    const maxSpills = Math.max(...filteredData.map(item => item.Spill_Count));
    const minSpills = Math.min(...filteredData.map(item => item.Spill_Count));

    return { totalSpills, avgSpills, maxSpills, minSpills, totalRegions: filteredData.length };
  };

  const stats = getSummaryStats();

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2>📈 Data Analysis</h2>

      <div className="grid grid-cols-1 2fr gap-8 mt-6">
        {/* Summary Stats */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Data Summary</h3>
          {stats ? (
            <table className="w-full mt-4">
              <tbody>
                <tr>
                  <td className="p-3 border-b border-gray-300 font-semibold">Total Regions:</td>
                  <td className="p-3 border-b border-gray-300">{stats.totalRegions}</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-300 font-semibold">Total Spills:</td>
                  <td className="p-3 border-b border-gray-300">{stats.totalSpills}</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-300 font-semibold">Average Spills:</td>
                  <td className="p-3 border-b border-gray-300">{stats.avgSpills}</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-300 font-semibold">Max Spills:</td>
                  <td className="p-3 border-b border-gray-300">{stats.maxSpills}</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-gray-300 font-semibold">Min Spills:</td>
                  <td className="p-3 border-b border-gray-300">{stats.minSpills}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No data available</p>
          )}
        </div>

        {/* Visualization */}
        <div className="bg-white p-6 rounded-lg mt-8">
          <h3 className="text-lg font-medium mb-4">Spill Count Visualization</h3>
          {chartData.length > 0 ? (
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spillCount" fill="#3498db" name="Spill Count" />
            </BarChart>
          ) : (
            <p>No data to display</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <h3 className="text-lg font-medium mb-4">Filter Data</h3>
        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Filter by Region:</label>
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="All">All</option>
              {Array.isArray(data) && [...new Set(data.map(item => item.Region))].map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Minimum Spill Count: {spillFilter}</label>
            <input
              type="range"
              min="0"
              max="20"
              value={spillFilter}
              onChange={(e) => setSpillFilter(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Filtered Data Table */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Filtered Data Table</h3>
        {filteredData.length > 0 ? (
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr>
                <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Region</th>
                <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Spill Count</th>
                <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">ROI Level</th>
                <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Latitude</th>
                <th className="p-3 text-left border-b border-gray-300 bg-gray-200 font-semibold">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 text-left border-b border-gray-300">{item.Region}</td>
                  <td className="p-3 text-left border-b border-gray-300">{item.Spill_Count}</td>
                  <td className="p-3 text-left border-b border-gray-300">{item.ROI_Level}</td>
                  <td className="p-3 text-left border-b border-gray-300">{item.Lat}</td>
                  <td className="p-3 text-left border-b border-gray-300">{item.Lon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data matches the selected filters</p>
        )}
      </div>
    </div>
  );
}

export default DataAnalysis;
