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
    <div className="bg-white p-8 rounded-lg">
      <h2>📤 Upload Dataset</h2>

      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <h3 className="text-lg font-medium mb-4">Upload Your Data</h3>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="w-full p-2 mt-4"
          />
          <p className="text-sm text-gray-600">Upload a CSV file with columns: Region, Spill_Count, ROI_Level, Lat, Lon</p>
          <button 
            onClick={handleUpload} 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
          <hr className="my-4" />
          <button onClick={downloadSample} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">
            Download Sample Data
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <h3 className="text-lg font-medium mb-4">Data Preview</h3>
          {data.length > 0 ? (
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
                {data.map((row, index) => (
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
            <p>No data uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadData;