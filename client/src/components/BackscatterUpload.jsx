import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function BackscatterUpload() {
  const [file, setFile] = useState(null);
  const [backscatterData, setBackscatterData] = useState([]);
  const [loading, setLoading] = useState(false);

  const sampleData = [
    { Region: 'Gulf of Mexico', Lat: 25.5, Lon: -90.2, VV_Backscatter: -28.5, HH_Backscatter: -25.1, Date: '2023-05-15' },
    { Region: 'North Sea', Lat: 58.0, Lon: 2.0, VV_Backscatter: -12.3, HH_Backscatter: -10.8, Date: '2023-05-16' },
    { Region: 'Persian Gulf', Lat: 26.5, Lon: 53.0, VV_Backscatter: -26.7, HH_Backscatter: -23.4, Date: '2023-05-17' },
    { Region: 'Niger Delta', Lat: 5.0, Lon: 6.0, VV_Backscatter: -24.1, HH_Backscatter: -21.7, Date: '2023-05-18' },
    { Region: 'Bay of Bengal', Lat: 15.0, Lon: 88.0, VV_Backscatter: -14.5, HH_Backscatter: -12.2, Date: '2023-05-19' }
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/backscatter/upload`,
        formData
      );
      setBackscatterData(response.data.data);
      alert('Backscatter data uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const useSampleData = () => {
    setBackscatterData(sampleData);
  };

  const getMarkerColor = (vvBackscatter) => {
    if (vvBackscatter < -25) return '#00008B';
    if (vvBackscatter < -20) return '#483D8B';
    if (vvBackscatter < -15) return '#006400';
    if (vvBackscatter < -10) return '#9ACD32';
    return '#FFFF00';
  };

  const getStats = () => {
    if (backscatterData.length === 0) return null;

    const avgVV = (backscatterData.reduce((sum, d) => sum + d.VV_Backscatter, 0) / backscatterData.length).toFixed(2);
    const minVV = Math.min(...backscatterData.map(d => d.VV_Backscatter)).toFixed(2);
    const maxVV = Math.max(...backscatterData.map(d => d.VV_Backscatter)).toFixed(2);
    const avgHH = (backscatterData.reduce((sum, d) => sum + d.HH_Backscatter, 0) / backscatterData.length).toFixed(2);
    const suspectedSpills = backscatterData.filter(d => d.VV_Backscatter < -20).length;

    return { avgVV, minVV, maxVV, avgHH, suspectedSpills };
  };

  const stats = getStats();

  return (
    <div className="backscatter-upload-container">
      <h2>📡 Upload Actual Backscatter Data</h2>

      <div className="upload-section">
        {/* Upload Panel */}
        <div className="upload-box">
          <h3>Upload Satellite Data</h3>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="file-input"
          />
          <p>Upload CSV with columns: Region, Lat, Lon, VV_Backscatter, HH_Backscatter, Date</p>
          
          <div className="button-group">
            <button 
              onClick={handleUpload} 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Uploading...' : '📤 Upload Data'}
            </button>
            <button 
              onClick={useSampleData}
              className="btn btn-info"
            >
              📋 Use Sample Data
            </button>
          </div>

          <hr />

          <div className="status-box">
            <h4>Data Status:</h4>
            <p>
              {backscatterData.length > 0 
                ? `🟢 ${backscatterData.length} satellite measurements loaded`
                : '📋 No data loaded - Upload file or use sample data'
              }
            </p>
          </div>
        </div>

        {/* Detection Summary */}
        {stats && (
          <div className="detection-summary">
            <h3 style={{color: 'red'}}>Official Detection Summary</h3>
            <p className="detection-text">
              🔍 {stats.suspectedSpills} of {backscatterData.length} measurements 
              show potential oil spills (VV &lt; -20 dB)
            </p>
            
            <h4>Backscatter Statistics</h4>
            <table className="stats-table">
              <tbody>
                <tr>
                  <td>Avg VV Backscatter:</td>
                  <td>{stats.avgVV} dB</td>
                </tr>
                <tr>
                  <td>Min VV Backscatter:</td>
                  <td>{stats.minVV} dB</td>
                </tr>
                <tr>
                  <td>Max VV Backscatter:</td>
                  <td>{stats.maxVV} dB</td>
                </tr>
                <tr>
                  <td>Avg HH Backscatter:</td>
                  <td>{stats.avgHH} dB</td>
                </tr>
                <tr>
                  <td>Suspected Spills:</td>
                  <td style={{color: 'red', fontWeight: 'bold'}}>{stats.suspectedSpills}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Map and Chart */}
      {backscatterData.length > 0 && (
        <div className="visualization-section">
          <div className="map-container">
            <h3>Backscatter Measurement Map</h3>
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {backscatterData.map((point, index) => (
                <CircleMarker
                  key={index}
                  center={[point.Lat, point.Lon]}
                  radius={8}
                  fillColor={getMarkerColor(point.VV_Backscatter)}
                  color={getMarkerColor(point.VV_Backscatter)}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.8}
                >
                  <Popup>
                    <strong>Region:</strong> {point.Region}<br />
                    <strong>VV Backscatter:</strong> {point.VV_Backscatter.toFixed(2)} dB<br />
                    <strong>HH Backscatter:</strong> {point.HH_Backscatter.toFixed(2)} dB<br />
                    <strong>Date:</strong> {point.Date}<br />
                    <strong>Data Type:</strong> ACTUAL_SATELLITE
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          <div className="chart-container">
            <h3>Backscatter Time Series</h3>
            <LineChart width={400} height={500} data={backscatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="VV_Backscatter" stroke="#8884d8" name="VV" />
              <Line type="monotone" dataKey="HH_Backscatter" stroke="#82ca9d" name="HH" />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
}

export default BackscatterUpload;