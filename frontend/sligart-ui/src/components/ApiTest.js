import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [pingResult, setPingResult] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Тест ping endpoint
  const testPing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test/ping');
      const data = await response.json();
      setPingResult(data);
    } catch (err) {
      setError('Ping failed: ' + err.message);
    }
    setLoading(false);
  };

  // Тест получения разработчиков
  const testGetDevelopers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test/developers');
      const data = await response.json();
      setDevelopers(data);
    } catch (err) {
      setError('Get developers failed: ' + err.message);
    }
    setLoading(false);
  };

  // Тест создания разработчика
  const testCreateDeveloper = async () => {
    setLoading(true);
    setError(null);
    try {
      const newDev = {
        id: 0,
        name: "Test Dev",
        skills: ["React", "Testing"]
      };

      const response = await fetch('/api/test/developers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDev)
      });

      const data = await response.json();
      console.log('Created developer:', data);
      alert('Developer created: ' + data.name);
    } catch (err) {
      setError('Create developer failed: ' + err.message);
    }
    setLoading(false);
  };

  // Автоматически тестируем ping при загрузке
  useEffect(() => {
    testPing();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 API Test Page</h1>

      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <h2>Ping Test</h2>
        <button onClick={testPing}>Test Ping</button>
        {pingResult && (
          <pre style={{ background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(pingResult, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Get Developers</h2>
        <button onClick={testGetDevelopers}>Get Developers</button>
        {developers.length > 0 && (
          <div>
            {developers.map(dev => (
              <div key={dev.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h3>{dev.name}</h3>
                <p>Skills: {dev.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>Create Developer</h2>
        <button onClick={testCreateDeveloper}>Create Test Developer</button>
      </div>
    </div>
  );
};

export default ApiTest;