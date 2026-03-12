import React, { useMemo, useState } from 'react';
import { MapContainer, Polygon, TileLayer, useMapEvents } from 'react-leaflet';
import API from '../utils/api';
import 'leaflet/dist/leaflet.css';

function pointsToGeoJson(points) {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [points[0].lng, points[0].lat],
          [points[1].lng, points[1].lat],
          [points[2].lng, points[2].lat],
          [points[0].lng, points[0].lat]
        ]
      ]
    }
  };
}

function AOISelector({ onAOIChange }) {
  const [points, setPoints] = useState([]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      const next = [...points, { lat, lng }].slice(0, 3);
      setPoints(next);

      if (next.length === 3) {
        onAOIChange(next);
        setPoints([]);
      }
    }
  });

  return null;
}

function Sentinel1AOI() {
  const [aoiPoints, setAoiPoints] = useState(null);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchResult, setFetchResult] = useState(null);

  const polygonPositions = useMemo(() => {
    if (!aoiPoints) return null;
    return aoiPoints.map(p => [p.lat, p.lng]);
  }, [aoiPoints]);

  const aoiGeoJson = useMemo(() => {
    if (!aoiPoints || aoiPoints.length !== 3) return null;
    return pointsToGeoJson(aoiPoints);
  }, [aoiPoints]);

  const clearAOI = () => {
    setAoiPoints(null);
    setError('');
    setFetchResult(null);
  };

  const copyGeoJson = async () => {
    if (!aoiGeoJson) return;
    await navigator.clipboard.writeText(JSON.stringify(aoiGeoJson));
  };

  const fetchAoiData = async () => {
    try {
      setError('');
      setFetchResult(null);

      if (!aoiGeoJson) {
        setError('Please draw an AOI first.');
        return;
      }

      setFetchLoading(true);
      const res = await API.post('/api/sentinel1/aoi-metrics', {
        geojson: aoiGeoJson,
        polarization: 'VV',
        orbitPass: 'DESCENDING',
        instrumentMode: 'IW',
        scale: 10,
        textureSize: 3,
        oilThresholdDb: -20
      });

      setFetchResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to fetch AOI data');
    } finally {
      setFetchLoading(false);
    }
  };


  return (
    <div className="bg-white p-8 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">🛰️ Sentinel-1 AOI Selection</h2>
        <div className="flex gap-3">
          <button
            onClick={fetchAoiData}
            disabled={!aoiGeoJson || fetchLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {fetchLoading ? 'Fetching...' : 'Fetch Data'}
          </button>
          <button
            onClick={clearAOI}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            type="button"
          >
            Clear
          </button>
          <button
            onClick={copyGeoJson}
            disabled={!aoiGeoJson}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Copy GeoJSON
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="text-sm text-gray-600 mb-4">
        Click three points on the map to create a triangular AOI.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <MapContainer center={[20, 0]} zoom={2} style={{ height: '520px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <AOISelector onAOIChange={setAoiPoints} />
            {polygonPositions && (
              <Polygon positions={polygonPositions} pathOptions={{ color: '#2563eb', weight: 2 }} />
            )}
          </MapContainer>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">AOI GeoJSON</div>
          <textarea
            className="w-full h-[520px] font-mono text-xs p-3 rounded-lg border border-gray-200 bg-gray-50"
            readOnly
            value={aoiGeoJson ? JSON.stringify(aoiGeoJson, null, 2) : ''}
            placeholder="Draw an AOI to generate GeoJSON"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Fetched Metrics (raw)</div>
        <textarea
          className="w-full h-[280px] font-mono text-xs p-3 rounded-lg border border-gray-200 bg-gray-50"
          readOnly
          value={fetchResult ? JSON.stringify(fetchResult, null, 2) : ''}
          placeholder="Click Fetch Data to retrieve Sentinel-1 metrics for the selected AOI"
        />
      </div>

    </div>
  );
}

export default Sentinel1AOI;
