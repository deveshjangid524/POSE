function Overview() {
  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="nav-brand">🌊 Oil Spill Event Prediction</div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/overview">Overview</a>
          <a href="/dashboard">Dashboard</a>
        </div>
      </nav>

      <div className="content-wrapper">
        <h2>Project Overview</h2>
        <p>The system consists of three main components:</p>
        <ol>
          <li>Data Collection & Processing (including SAR backscatter data)</li>
          <li>ML Model for Spill Prediction using backscatter patterns</li>
          <li>Interactive Dashboard for ROI and backscatter visualization</li>
        </ol>

        <div className="overview-image">
          <img 
            src="/images/I1.jpg" 
            alt="Oil Spill Overview" 
            style={{
              width: '100%',
              borderRadius: '15px',
              boxShadow: '0px 4px 15px rgba(0,0,0,0.4)',
              marginTop: '20px'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Overview;