import React from 'react'
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UploadData from './UploadData';
import ManualInput from './ManualInput';
import ROIMap from './ROIMap';
import BackscatterPreview from './BackscatterPreview';
import BackscatterUpload from './BackscatterUpload';
import SentinelFilter from './SentinelFilter';
import Sentinel1AOI from './Sentinel1AOI';
import DataAnalysis from './DataAnalysis';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 text-white p-0">
          <div className="flex flex-col">
            <div 
              className={`p-4 cursor-pointer transition-colors duration-300 border-l-4 border-transparent hover:bg-slate-700 ${activeTab === 'upload' ? 'bg-blue-500 border-l-white' : ''}`}
              onClick={() => handleTabClick('upload', '/dashboard/upload')}
            >
              📤 Upload Dataset
            </div>

            <div 
              className={`p-4 cursor-pointer transition-colors duration-300 border-l-4 border-transparent hover:bg-slate-700 ${activeTab === 'manual' ? 'bg-blue-500 border-l-white' : ''}`}
              onClick={() => handleTabClick('manual', '/dashboard/manual-input')}
            >
              ✏️ Manual Data Input
            </div>

            <div 
              className={`p-4 cursor-pointer transition-colors duration-300 border-l-4 border-transparent hover:bg-slate-700 ${activeTab === 'roi' ? 'bg-blue-500 border-l-white' : ''}`}
              onClick={() => handleTabClick('roi', '/dashboard/roi')}
            >
              🗺️ ROI Visualization
            </div>

            <div className="mt-4">
              <div className="p-2 text-sm text-gray-400 font-bold">📡 Backscatter Analysis</div>
              <div 
                className={`p-3 cursor-pointer transition-colors duration-300 text-sm hover:bg-slate-700 ${activeTab === 'backscatter-preview' ? 'bg-blue-600' : ''}`}
                onClick={() => handleTabClick('backscatter-preview', '/dashboard/backscatter-preview')}
              >
                👁️ Preview Backscatter
              </div>
              <div 
                className={`p-3 cursor-pointer transition-colors duration-300 text-sm hover:bg-slate-700 ${activeTab === 'backscatter-upload' ? 'bg-blue-600' : ''}`}
                onClick={() => handleTabClick('backscatter-upload', '/dashboard/backscatter-upload')}
              >
                📤 Upload Actual Data
              </div>
            </div>

            <div className="mt-4">
              <div className="p-2 text-sm text-gray-400 font-bold">🔍 SAR Data Filtering</div>
              <div 
                className={`p-3 cursor-pointer transition-colors duration-300 text-sm hover:bg-slate-700 ${activeTab === 'sentinel' ? 'bg-blue-600' : ''}`}
                onClick={() => handleTabClick('sentinel', '/dashboard/sentinel-filter')}
              >
                🛰️ Sentinel-1 Filter
              </div>
            </div>

            <div 
              className={`p-4 cursor-pointer transition-colors duration-300 border-l-4 border-transparent hover:bg-slate-700 ${activeTab === 'analysis' ? 'bg-blue-500 border-l-white' : ''}`}
              onClick={() => handleTabClick('analysis', '/dashboard/analysis')}
            >
              📊 Data Analysis
            </div>

            <div 
              className={`p-4 cursor-pointer transition-colors duration-300 border-l-4 border-transparent hover:bg-slate-700 ${activeTab === 'sentinel1' ? 'bg-blue-500 border-l-white' : ''}`}
              onClick={() => handleTabClick('sentinel1', '/dashboard/sentinel1')}
            >
              🛰️ Sentinel-1
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<UploadData />} />
            <Route path="/upload" element={<UploadData />} />
            <Route path="/manual-input" element={<ManualInput />} />
            <Route path="/roi" element={<ROIMap />} />
            <Route path="/backscatter-preview" element={<BackscatterPreview />} />
            <Route path="/backscatter-upload" element={<BackscatterUpload />} />
            <Route path="/sentinel-filter" element={<SentinelFilter />} />
            <Route path="/analysis" element={<DataAnalysis />} />
            <Route path="/sentinel1" element={<Sentinel1AOI />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;