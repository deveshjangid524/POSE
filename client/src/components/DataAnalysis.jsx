import React from 'react'
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function DataAnalysis({ aoiMetrics }) {
  const [data, setData] = useState([]);
  const [regionFilter, setRegionFilter] = useState('All');
  const [spillFilter, setSpillFilter] = useState(0);

  const computeOilSpillProbability = () => {
    const dm = aoiMetrics?.derived_metrics;
    if (!dm) return null;

    const vvMean = typeof dm.mean_backscatter === 'number' ? dm.mean_backscatter : null;
    const vvStd = typeof dm.std_backscatter === 'number' ? dm.std_backscatter : null;
    const oilAreaKm2 = typeof dm.oil_area_km2 === 'number' ? dm.oil_area_km2 : 0;
    const contrast = typeof dm.texture_contrast === 'number' ? dm.texture_contrast : null;
    const homogeneity = typeof dm.texture_homogeneity === 'number' ? dm.texture_homogeneity : null;

    if (vvMean == null) return null;

    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));

    const backscatterScore = clamp01((-17 - vvMean) / 8);
    const stdScore = vvStd == null ? 0.5 : clamp01((2.0 - vvStd) / 2.0);
    const areaScore = clamp01(oilAreaKm2 / 2.0);
    const contrastScore = contrast == null ? 0.5 : clamp01((0.8 - contrast) / 0.8);
    const homogeneityScore = homogeneity == null ? 0.5 : clamp01(homogeneity / 2.0);

    const logit =
      -1.2 +
      2.2 * backscatterScore +
      1.0 * areaScore +
      0.6 * stdScore +
      0.4 * contrastScore +
      0.4 * homogeneityScore;

    const probability = clamp01(sigmoid(logit));
    const isOilSpill = probability >= 0.5;

    return {
      probability,
      isOilSpill,
      features: {
        mean_backscatter: vvMean,
        std_backscatter: vvStd,
        oil_area_km2: oilAreaKm2,
        texture_contrast: contrast,
        texture_homogeneity: homogeneity
      }
    };
  };

  const aoiAnalysis = computeOilSpillProbability();

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

      {aoiMetrics && (
        <div className="bg-gray-50 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-medium mb-4">AOI Oil Spill Analysis</h3>

          {!aoiAnalysis ? (
            <p>AOI metrics received, but not enough fields are available to compute a probability.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-700">Prediction</div>
                <div className="text-xl font-semibold mt-1">
                  {aoiAnalysis.isOilSpill ? 'Oil spill likely' : 'Oil spill unlikely'}
                </div>
                <div className="text-sm text-gray-700 mt-3">Probability</div>
                <div className="text-lg font-medium mt-1">
                  {(aoiAnalysis.probability * 100).toFixed(1)}%
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">AOI Features Used</div>
                <div className="text-xs font-mono bg-white border border-gray-200 rounded-lg p-3 overflow-auto max-h-[180px]">
                  {JSON.stringify(aoiAnalysis.features, null, 2)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
