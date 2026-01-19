import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UploadData from './UploadData';
import ManualInput from './ManualInput';
import ROIMap from './ROIMap';
import BackscatterPreview from './BackscatterPreview';
import BackscatterUpload from './BackscatterUpload';
import SentinelFilter from './SentinelFilter';
import DataAnalysis from './DataAnalysis';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2>🌊 Oil Spill Dashboard</h2>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-menu">
            <div 
              className={`menu-item ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => handleTabClick('upload', '/dashboard/upload')}
            >
              📤 Upload Dataset
            </div>

            <div 
              className={`menu-item ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => handleTabClick('manual', '/dashboard/manual-input')}
            >
              ✏️ Manual Data Input
            </div>

            <div 
              className={`menu-item ${activeTab === 'roi' ? 'active' : ''}`}
              onClick={() => handleTabClick('roi', '/dashboard/roi')}
            >
              🗺️ ROI Visualization
            </div>

            <div className="menu-section">
              <div className="menu-section-title">📡 Backscatter Analysis</div>
              <div 
                className={`menu-subitem ${activeTab === 'backscatter-preview' ? 'active' : ''}`}
                onClick={() => handleTabClick('backscatter-preview', '/dashboard/backscatter-preview')}
              >
                👁️ Preview Backscatter
              </div>
              <div 
                className={`menu-subitem ${activeTab === 'backscatter-upload' ? 'active' : ''}`}
                onClick={() => handleTabClick('backscatter-upload', '/dashboard/backscatter-upload')}
              >
                📤 Upload Actual Data
              </div>
            </div>

            <div className="menu-section">
              <div className="menu-section-title">🔍 SAR Data Filtering</div>
              <div 
                className={`menu-subitem ${activeTab === 'sentinel' ? 'active' : ''}`}
                onClick={() => handleTabClick('sentinel', '/dashboard/sentinel-filter')}
              >
                🛰️ Sentinel-1 Filter
              </div>
            </div>

            <div 
              className={`menu-item ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => handleTabClick('analysis', '/dashboard/analysis')}
            >
              📊 Data Analysis
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<UploadData />} />
            <Route path="/upload" element={<UploadData />} />
            <Route path="/manual-input" element={<ManualInput />} />
            <Route path="/roi" element={<ROIMap />} />
            <Route path="/backscatter-preview" element={<BackscatterPreview />} />
            <Route path="/backscatter-upload" element={<BackscatterUpload />} />
            <Route path="/sentinel-filter" element={<SentinelFilter />} />
            <Route path="/analysis" element={<DataAnalysis />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;