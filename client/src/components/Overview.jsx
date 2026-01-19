function Overview() {
  return (
    <div className="min-h-screen bg-gray-100" style={{backgroundImage: 'url(/src/assets/I1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="max-w-6xl mx-auto p-8 bg-white mt-8 rounded-lg shadow-md bg-opacity-95">
        <h2 className="text-slate-800 mb-4">Project Overview</h2>
        <p>The system consists of three main components:</p>
        <ol className="ml-8 leading-relaxed">
          <li>Data Collection & Processing (including SAR backscatter data)</li>
          <li>ML Model for Spill Prediction using backscatter patterns</li>
          <li>Interactive Dashboard for ROI and backscatter visualization</li>
        </ol>

        <div className="overview-image">
          <img 
            src="/images/I1.jpg" 
            alt="Oil Spill Overview" 
            className="w-full rounded-xl shadow-lg mt-5"
          />
        </div>
      </div>
    </div>
  );
}

export default Overview;