import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

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
        <h2>About the Project</h2>
        <p>
          This project aims to predict oil spill events using machine learning 
          and real-time datasets.
        </p>
        <p>
          By analyzing datasets such as satellite images, sea current patterns, 
          and historical spill data, we provide insights and prevent environmental disasters.
        </p>

        <h3>Key Goals:</h3>
        <ul>
          <li>Early prediction of oil spills</li>
          <li>Automated monitoring using SAR backscatter data</li>
          <li>Dashboard for real-time alerts</li>
          <li>Region of Interest (ROI) visualization</li>
        </ul>

        <h3>Backscatter Technology</h3>
        <p>
          Backscatter is the reflection of radar signals back to the satellite. 
          It's crucial for oil spill detection:
        </p>
        <ul>
          <li>Normal sea surface: High backscatter (bright in SAR images)</li>
          <li>Oil-covered water: Low backscatter (dark patches in SAR images)</li>
          <li>VV polarization provides the best contrast for oil spill detection</li>
        </ul>
      </div>
    </div>
  );
}

export default About;