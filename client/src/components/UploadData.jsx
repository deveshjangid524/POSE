import { useState, useRef } from 'react';
import axios from 'axios';

function UploadData() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('File selected:', selectedFile);
    setFile(selectedFile);
  };

  const handleUploadClick = () => {
    if (!file) {
      fileInputRef.current?.click();
    } else {
      handleUpload();
    }
  };

  const handleUpload = async () => {
    console.log('Current file state:', file);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">📤 Upload Dataset</h2>
          <p className="text-gray-600">Import your oil spill data for analysis and visualization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">📁</span>
              Upload Your Data
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-gray-700 font-medium mb-2">
                    {file ? file.name : 'Click to browse or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">CSV files only</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Required columns:</strong> Region, Spill_Count, ROI_Level, Lat, Lon
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleUploadClick} 
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {file ? '🚀 Upload File' : '📂 Select File'}
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={downloadSample} 
                  className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  📥 Sample
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-green-100 text-green-600 rounded-lg p-2 mr-3">👁️</span>
              Data Preview
            </h3>
            {data.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">Region</th>
                        <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">Spill Count</th>
                        <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">ROI Level</th>
                        <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">Latitude</th>
                        <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">Longitude</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.map((row, index) => (
                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="p-3 text-gray-800">{row.Region}</td>
                          <td className="p-3 text-gray-800">{row.Spill_Count}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              row.ROI_Level === 'Very High' ? 'bg-red-100 text-red-800' :
                              row.ROI_Level === 'High' ? 'bg-orange-100 text-orange-800' :
                              row.ROI_Level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {row.ROI_Level}
                            </span>
                          </td>
                          <td className="p-3 text-gray-800">{row.Lat}</td>
                          <td className="p-3 text-gray-800">{row.Lon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">📊</div>
                <p className="text-gray-500 text-lg">No data uploaded yet</p>
                <p className="text-gray-400 text-sm mt-2">Upload a CSV file to see your data here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadData;