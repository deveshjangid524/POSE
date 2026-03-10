import React, { useState, useEffect } from 'react';
import API from '../utils/api';

function TestConnection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await API.get('/api/test');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div>Testing connection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">✅ Connection Successful!</h3>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default TestConnection;
