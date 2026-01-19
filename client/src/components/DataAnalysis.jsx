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
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredData = data.filter(item => {
    const matchesRegion = regionFilter === 'All' || item.Region === regionFilter;
    const matchesSpill = item.Spill_Count >= spillFilter;
    return matchesRegion && matchesSpill;
  });

  const chartData = filteredData.map(item => ({
    region: item.Region,
    spillCount: item.Spill_Count
  }));

  const getSummaryStats = () => {
    if (filteredData.length === 0) return null;

    const totalSpills = filteredData.reduce((sum, item) => sum + item.Spill_Count, 0);
    const avgSpills = (totalSpills / filteredData.length).toFixed(2);
    const maxSpills = Math.max(...filteredData.map(item => item.Spill_Count));
    const minSpills = Math.min(...filteredData.map(item => item.Spill_Count));

    return { totalSpills, avgSpills, maxSpills, minSpills, totalRegions: filteredData.length };
  };

  const stats = getSummaryStats();

  return (
    <div className="analysis-container">
      <h2>📈 Data Analysis</h2>

      <div className="analysis-grid">
        {/* Summary Stats */}
        <div className="summary-panel">
          <h3>Data Summary</h3>
          {stats ? (
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Total Regions:</td>
                  <td>{stats.totalRegions}</td>
                </tr>
                <tr>
                  <td>Total Spills:</td>
                  <td>{stats.totalSpills}</td>
                </tr>
                <tr>
                  <td>Average Spills:</td>
                  <td>{stats.avgSpills}</td>
                </tr>
                <tr>
                  <td>Max Spills:</td>
                  <td>{stats.maxSpills}</td>
                </tr>
                <tr>
                  <td>Min Spills:</td>
                  <td>{stats.minSpills}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No data available</p>
          )}
        </div>

        {/* Visualization */}
        <div className="chart-panel">
          <h3>Spill Count Visualization</h3>
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
      <div className="filter-section">
        <h3>Filter Data</h3>
        <div className="filter-controls">
          <div className="form-group">
            <label>Filter by Region:</label>
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="All">All</option>
              {[...new Set(data.map(item => item.Region))].map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Minimum Spill Count: {spillFilter}</label>
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
      <div className="table-section">
        <h3>Filtered Data Table</h3>
        {filteredData.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Spill Count</th>
                <th>ROI Level</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Region}</td>
                  <td>{item.Spill_Count}</td>
                  <td>{item.ROI_Level}</td>
                  <td>{item.Lat}</td>
                  <td>{item.Lon}</td>
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
