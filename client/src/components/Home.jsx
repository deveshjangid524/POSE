import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen m-0 p-0">
      <div className="bg-cover bg-center bg-fixed h-[calc(100vh-60px)] flex justify-center items-center relative" style={{backgroundImage: 'url(/src/assets/I1.jpg)'}}>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
        <div className="relative z-20 text-center text-white">
          <h1 className="text-5xl font-bold mb-4 shadow-[2px_2px_8px_rgba(0,0,0,0.6)]">🌍 Oil Spill Event Prediction</h1>
          <h3 className="text-2xl mb-8 shadow-[1px_1px_4px_rgba(0,0,0,0.5)]">Predicting, Monitoring & Preventing Oil Spills with Data</h3>
          <div className="flex gap-4 justify-center">
            <button 
              className="bg-blue-500 text-white p-3 text-xl border-none rounded cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5" 
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
            <button 
              className="bg-green-600 text-white p-3 text-xl border-none rounded cursor-pointer transition-all duration-300 hover:bg-green-700 hover:-translate-y-0.5" 
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