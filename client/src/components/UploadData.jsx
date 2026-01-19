import { useState } from 'react';
import axios from 'axios';

function UploadData() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
        `${import.meta.env.VITE_API_URL}/data/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setData(response.data.data);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const sampleData = `Region,Spill_Count,ROI_Level,Lat,Lon
Bay of Bengal,10,High,15,91
Arabian Sea,7,Medium,22,65
North Atlantic,15,Very High,30,-40
Pacific,5,Low,10,-160`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_oilspill.csv';
    a.click();
  };

  return (
    <div className="upload-container">
      <h2>📤 Upload Dataset</h2>

      <div className="upload-grid">
        <div className="upload-box">
          <h3>Upload Your Data</h3>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="file-input"
          />
          <p>Upload a CSV file with columns: Region, Spill_Count, ROI_Level, Lat, Lon</p>
          <button 
            onClick={handleUpload} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
          <hr />
          <button onClick={downloadSample} className="btn btn-info">
            Download Sample Data
          </button>
        </div>

        <div className="preview-box">
          <h3>Data Preview</h3>
          {data.length > 0 ? (
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
                {data.map((row, index) => (
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
            <p>No data uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadData;