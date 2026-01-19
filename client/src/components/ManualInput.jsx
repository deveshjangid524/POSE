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
      setManualData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <div className="manual-input-container">
      <h2>✏️ Manual Data Input</h2>

      <div className="manual-grid">
        <div className="form-box">
          <h3>Add New Data Point</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Region Name</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Enter region name"
                required
              />
            </div>

            <div className="form-group">
              <label>Spill Count</label>
              <input
                type="number"
                name="spillCount"
                value={formData.spillCount}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>ROI Level</label>
              <select
                name="roiLevel"
                value={formData.roiLevel}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                step="0.0001"
                min="-90"
                max="90"
                required
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                name="lon"
                value={formData.lon}
                onChange={handleChange}
                step="0.0001"
                min="-180"
                max="180"
                required
              />
            </div>

            <button type="submit" className="btn btn-success">
              ➕ Add Data Point
            </button>
          </form>
        </div>

        <div className="table-box">
          <h3>Manual Data Records</h3>
          {manualData.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Spill Count</th>
                  <th>ROI Level</th>
                  <th>Lat</th>
                  <th>Lon</th>
                </tr>
              </thead>
              <tbody>
                {manualData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.Region}</td>
                    <td>{row.Spill_Count}</td>
                    <td>{row.ROI_Level}</td>
                    <td>{row.Lat}</td>
                    <td>{row.Lon}</td>
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