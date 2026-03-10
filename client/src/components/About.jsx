import React from 'react'
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{backgroundImage: 'url(/src/assets/I1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="min-h-screen backdrop-blur-sm">
        <div className="max-w-6xl mx-auto p-4 mt-2 rounded-2xl shadow-2xl bg-white/40 backdrop-blur-md border border-white/20">
            <div className="mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 text-center">
                🌊 About the Project
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full mb-4"></div>
            
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">🎯</span>
                  Mission
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This project aims to predict oil spill events using machine learning 
                  and real-time datasets, revolutionizing environmental protection.
                </p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">📊</span>
                  Approach
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  By analyzing datasets such as satellite images, sea current patterns, 
                  and historical spill data, we provide insights and prevent environmental disasters.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 mb-4 border border-blue-200 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white mr-2 text-xs">⚡</span>
                Key Goals
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">🔮</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Early Prediction</h4>
                    <p className="text-xs text-slate-600">Advanced ML algorithms for timely alerts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">🛰️</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">SAR Monitoring</h4>
                    <p className="text-xs text-slate-600">Real-time backscatter data analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">📈</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Real-time Dashboard</h4>
                    <p className="text-xs text-slate-600">Interactive visualization & alerts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">🗺️</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">ROI Visualization</h4>
                    <p className="text-xs text-slate-600">Region of Interest mapping</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 border border-purple-200 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mr-2 text-xs">📡</span>
                Backscatter Technology
              </h3>
              <div className="bg-white/70 rounded-xl p-3 backdrop-blur-sm mb-3">
                <p className="text-sm text-slate-700 font-medium mb-2">
                  Backscatter is the reflection of radar signals back to the satellite. 
                  It's crucial for oil spill detection:
                </p>
                <div className="grid md:grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                    <div className="text-xl mb-1">💡</div>
                    <h4 className="text-sm font-semibold text-blue-800">Normal Sea</h4>
                    <p className="text-xs text-blue-700">High backscatter (bright in SAR)</p>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                    <div className="text-xl mb-1">🛢️</div>
                    <h4 className="text-sm font-semibold text-gray-800">Oil Spill</h4>
                    <p className="text-xs text-gray-700">Low backscatter (dark patches)</p>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                    <div className="text-xl mb-1">📡</div>
                    <h4 className="text-sm font-semibold text-green-800">VV Polarization</h4>
                    <p className="text-xs text-green-700">Best contrast for detection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;