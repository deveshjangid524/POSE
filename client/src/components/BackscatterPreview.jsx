import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function BackscatterPreview() {
  const [simulationData, setSimulationData] = useState(null);
  const [config, setConfig] = useState({
    region: 'Gulf of Mexico',
    spillProbability: 30,
    vvThreshold: -20,
    windConditions: 2,
    customLat: 0,
    customLon: 0
  });

  const regionCenters = {
    'Gulf of Mexico': { lat: 25.5, lon: -90.2 },
    'North Sea': { lat: 58.0, lon: 2.0 },
    'Persian Gulf': { lat: 26.5, lon: 53.0 },
    'Bay of Bengal': { lat: 15.0, lon: 88.0 },
    'Custom Area': { lat: config.customLat, lon: config.customLon }
  };

  const generateSimulation = () => {
    const center = regionCenters[config.region];
    const nPoints = 50;
    const points = [];

    const baseBackscatter = -12 - (config.windConditions * 2);

    for (let i = 0; i < nPoints; i++) {
      const lat = center.lat + (Math.random() * 4 - 2);
      const lon = center.lon + (Math.random() * 4 - 2);
      
      let vvBackscatter = baseBackscatter + (Math.random() * 6 - 3);
      
      // Simulate spills based on probability
      if (Math.random() * 100 < config.spillProbability) {
        vvBackscatter = -25 + (Math.random() * 4 - 2);
      }

      const riskLevel = vvBackscatter < config.vvThreshold 
        ? 'High Risk' 
        : vvBackscatter < -18 
        ? 'Medium Risk' 
        : 'Low Risk';

      points.push({
        lat,
        lon,
        vvBackscatter,
        riskLevel
      });
    }

    setSimulationData(points);
  };

  const clearSimulation = () => {
    setSimulationData(null);
  };

  const getMarkerColor = (backscatter) => {
    if (backscatter < -25) return '#00008B';
    if (backscatter < -20) return '#483D8B';
    if (backscatter < -15) return '#006400';
    return '#9ACD32';
  };

  const getSummaryData = () => {
    if (!simulationData) return null;

    const highRisk = simulationData.filter(p => p.riskLevel === 'High Risk').length;
    const mediumRisk = simulationData.filter(p => p.riskLevel === 'Medium Risk').length;
    const lowRisk = simulationData.filter(p => p.riskLevel === 'Low Risk').length;
    const avgBackscatter = (simulationData.reduce((sum, p) => sum + p.vvBackscatter, 0) / simulationData.length).toFixed(2);

    return {
      totalPoints: simulationData.length,
      highRisk,
      mediumRisk,
      lowRisk,
      avgBackscatter,
      spillProbability: ((highRisk + mediumRisk) / simulationData.length * 100).toFixed(1)
    };
  };

  const getHistogramData = () => {
    if (!simulationData) return [];

    const bins = [-30, -25, -20, -15, -10, -5];
    const histogram = bins.map((bin, i) => {
      const nextBin = bins[i + 1] || 0;
      const count = simulationData.filter(p => 
        p.vvBackscatter >= bin && p.vvBackscatter < nextBin
      ).length;
      return {
        range: `${bin} to ${nextBin}`,
        count
      };
    });

    return histogram;
  };

  const summary = getSummaryData();

  return (
    <div className="backscatter-preview-container">
      <h2>🔬 Backscatter Preview Simulation</h2>

      <div className="preview-grid">
        {/* Controls Panel */}
        <div className="controls-panel">
          <h3>Simulation Controls</h3>

          <div className="form-group">
            <label>Region:</label>
            <select 
              value={config.region}
              onChange={(e) => setConfig({...config, region: e.target.value})}
            >
              <option value="Gulf of Mexico">Gulf of Mexico</option>
              <option value="North Sea">North Sea</option>
              <option value="Persian Gulf">Persian Gulf</option>
              <option value="Bay of Bengal">Bay of Bengal</option>
              <option value="Custom Area">Custom Area</option>
            </select>
          </div>

          {config.region === 'Custom Area' && (
            <>
              <div className="form-group">
                <label>Custom Latitude:</label>
                <input 
                  type="number" 
                  value={config.customLat}
                  onChange={(e) => setConfig({...config, customLat: Number(e.target.value)})}
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>Custom Longitude:</label>
                <input 
                  type="number" 
                  value={config.customLon}
                  onChange={(e) => setConfig({...config, customLon: Number(e.target.value)})}
                  step="0.1"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Spill Probability (%): {config.spillProbability}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.spillProbability}
              onChange={(e) => setConfig({...config, spillProbability: Number(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>VV Threshold (dB): {config.vvThreshold}</label>
            <input
              type="range"
              min="-30"
              max="-10"
              value={config.vvThreshold}
              onChange={(e) => setConfig({...config, vvThreshold: Number(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label>Wind Conditions:</label>
            <select 
              value={config.windConditions}
              onChange={(e) => setConfig({...config, windConditions: Number(e.target.value)})}
            >
              <option value="1">Calm</option>
              <option value="2">Moderate</option>
              <option value="3">Rough</option>
            </select>
          </div>

          <div className="button-group">
            <button onClick={generateSimulation} className="btn btn-success">
              ▶️ Run Simulation
            </button>
            <button onClick={clearSimulation} className="btn btn-warning">
              🗑️ Clear Simulation
            </button>
          </div>

          <hr />

          <div className="status-panel">
            <h4>Simulation Status:</h4>
            <p>
              {simulationData 
                ? `🟢 Simulation active - ${simulationData.length} simulated points`
                : '🔴 No simulation running - Click "Run Simulation"'
              }
            </p>
          </div>
        </div>

        {/* Map and Summary */}
        <div className="map-summary-panel">
          <h3>Simulation Map</h3>
          
          {simulationData ? (
            <MapContainer 
              center={[regionCenters[config.region].lat, regionCenters[config.region].lon]} 
              zoom={5} 
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {simulationData.map((point, index) => (
                <CircleMarker
                  key={index}
                  center={[point.lat, point.lon]}
                  radius={6}
                  fillColor={getMarkerColor(point.vvBackscatter)}
                  color={getMarkerColor(point.vvBackscatter)}
                  weight={1}
                  opacity={0.8}
                  fillOpacity={0.8}
                >
                  <Popup>
                    <strong>Simulated Point</strong><br />
                    VV Backscatter: {point.vvBackscatter.toFixed(2)} dB<br />
                    Risk Level: {point.riskLevel}<br />
                    <em>SIMULATION DATA</em>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          ) : (
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
              <p>Click "Run Simulation" to generate preview data</p>
            </div>
          )}

          {summary && (
            <div className="summary-grid">
              <div className="summary-box">
                <h4>Simulation Summary</h4>
                <table>
                  <tbody>
                    <tr>
                      <td>Total Points:</td>
                      <td>{summary.totalPoints}</td>
                    </tr>
                    <tr>
                      <td>High Risk Points:</td>
                      <td>{summary.highRisk}</td>
                    </tr>
                    <tr>
                      <td>Medium Risk Points:</td>
                      <td>{summary.mediumRisk}</td>
                    </tr>
                    <tr>
                      <td>Avg Backscatter:</td>
                      <td>{summary.avgBackscatter} dB</td>
                    </tr>
                    <tr>
                      <td>Spill Probability:</td>
                      <td>{summary.spillProbability}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="risk-indicator">
                <h4>Risk Assessment</h4>
                <div 
                  className="risk-box"
                  style={{
                    backgroundColor: summary.spillProbability > 30 ? 'red' : 
                                    summary.spillProbability > 15 ? 'orange' : 'green',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}
                >
                  <h3>
                    {summary.spillProbability > 30 ? 'HIGH' : 
                     summary.spillProbability > 15 ? 'MEDIUM' : 'LOW'}
                  </h3>
                  <p>High Risk Points: {summary.spillProbability}%</p>
                  <small>This is a training simulation - not real data</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backscatter Profile */}
      {simulationData && (
        <div className="chart-panel">
          <h3>Backscatter Distribution</h3>
          <BarChart width={800} height={250} data={getHistogramData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3498db" />
          </BarChart>
        </div>
      )}
    </div>
  );
}

export default BackscatterPreview;