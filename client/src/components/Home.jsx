import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-brand">🌊 Oil Spill Event Prediction</div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/overview">Overview</a>
          <a href="/dashboard">Dashboard</a>
        </div>
      </nav>

      <div className="hero-section">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>🌍 Oil Spill Event Prediction</h1>
          <h3>Predicting, Monitoring & Preventing Oil Spills with Data</h3>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;