import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100" style={{backgroundImage: 'url(/src/assets/I1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="max-w-6xl mx-auto p-8 bg-white mt-8 rounded-lg shadow-md bg-opacity-95">
        <h2 className="text-slate-800 mb-4">About the Project</h2>
        <p>
          This project aims to predict oil spill events using machine learning 
          and real-time datasets.
        </p>
        <p>
          By analyzing datasets such as satellite images, sea current patterns, 
          and historical spill data, we provide insights and prevent environmental disasters.
        </p>

        <h3 className="text-slate-700 mt-8 mb-2">Key Goals:</h3>
        <ul className="ml-8 leading-relaxed">
          <li>Early prediction of oil spills</li>
          <li>Automated monitoring using SAR backscatter data</li>
          <li>Dashboard for real-time alerts</li>
          <li>Region of Interest (ROI) visualization</li>
        </ul>

        <h3 className="text-slate-700 mt-8 mb-2">Backscatter Technology</h3>
        <p>
          Backscatter is the reflection of radar signals back to the satellite. 
          It's crucial for oil spill detection:
        </p>
        <ul className="ml-8 leading-relaxed">
          <li>Normal sea surface: High backscatter (bright in SAR images)</li>
          <li>Oil-covered water: Low backscatter (dark patches in SAR images)</li>
          <li>VV polarization provides the best contrast for oil spill detection</li>
        </ul>
      </div>
    </div>
  );
}

export default About;