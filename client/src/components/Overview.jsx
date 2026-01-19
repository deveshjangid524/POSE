function Overview() {
  return (
    <div className="min-h-screen" style={{backgroundImage: 'url(/src/assets/I1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="min-h-screen backdrop-blur-sm">
        <div className="max-w-6xl mx-auto p-4 mt-2 rounded-2xl shadow-2xl bg-white/40 backdrop-blur-md border border-white/20">
          <div className="mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 text-center">
              📊 Project Overview
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full mb-4"></div>
            
            <p className="text-base text-slate-700 text-center mb-4 leading-relaxed">
              An advanced oil spill detection system leveraging SAR technology and machine learning
            </p>

            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">📡</span>
                  Data Collection
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  SAR backscatter data processing and analysis for comprehensive environmental monitoring
                </p>
              </div>

              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">🤖</span>
                  ML Prediction
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Advanced machine learning models for accurate oil spill detection using backscatter patterns
                </p>
              </div>

              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">📈</span>
                  Dashboard
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Real-time visualization interface for ROI analysis and backscatter data exploration
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 mb-4 border border-blue-200 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white mr-2 text-xs">🎯</span>
                System Capabilities
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">🛰️</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">SAR Data Processing</h4>
                    <p className="text-xs text-slate-600">Advanced backscatter analysis algorithms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">🔮</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Predictive Analytics</h4>
                    <p className="text-xs text-slate-600">ML-powered spill detection models</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">🗺️</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">ROI Mapping</h4>
                    <p className="text-xs text-slate-600">Interactive region visualization</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-white/60 rounded-lg backdrop-blur-sm">
                  <span className="text-lg">⚡</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Real-time Monitoring</h4>
                    <p className="text-xs text-slate-600">24/7 environmental surveillance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 border border-purple-200 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mr-2 text-xs">📊</span>
                System Performance
              </h3>
              <div className="bg-white/70 rounded-xl p-3 backdrop-blur-sm">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                    <div className="text-xl font-bold text-blue-800 mb-1">95%</div>
                    <h4 className="text-sm font-semibold text-blue-800">Detection Accuracy</h4>
                    <p className="text-xs text-blue-700">High precision identification</p>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                    <div className="text-xl font-bold text-green-800 mb-1">24/7</div>
                    <h4 className="text-sm font-semibold text-green-800">Monitoring</h4>
                    <p className="text-xs text-green-700">Continuous surveillance</p>
                  </div>
                  <div className="text-center p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                    <div className="text-xl font-bold text-purple-800 mb-1">Global</div>
                    <h4 className="text-sm font-semibold text-purple-800">Coverage</h4>
                    <p className="text-xs text-purple-700">Worldwide deployment</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">🖼️</span>
                  System Visualization
                </h3>
                <div className="relative group">
                  <img 
                    src="/images/I1.jpg" 
                    alt="Oil Spill Detection System" 
                    className="w-full h-auto rounded-xl shadow-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x400?text=Oil+Spill+Detection+System";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;