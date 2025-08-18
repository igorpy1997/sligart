import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ApiTestPage = () => {
  const [pingResult, setPingResult] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Добавляем результат теста в список
  const addTestResult = (endpoint, method, status, data, error = null) => {
    setTestResults(prev => [...prev, {
      endpoint,
      method,
      status,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Тест ping endpoint
  const testPing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/test/ping');
      setPingResult(response.data);
      addTestResult('/api/test/ping', 'GET', response.status, response.data);
    } catch (err) {
      const errorMsg = 'Ping failed: ' + err.message;
      setError(errorMsg);
      addTestResult('/api/test/ping', 'GET', err.response?.status || 'Error', null, errorMsg);
    }
    setLoading(false);
  };

  // Тест получения разработчиков
  const testGetDevelopers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/test/developers');
      setDevelopers(response.data);
      addTestResult('/api/test/developers', 'GET', response.status, response.data);
    } catch (err) {
      const errorMsg = 'Get developers failed: ' + err.message;
      setError(errorMsg);
      addTestResult('/api/test/developers', 'GET', err.response?.status || 'Error', null, errorMsg);
    }
    setLoading(false);
  };

  // Тест получения проектов
  const testGetProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/test/projects');
      setProjects(response.data);
      addTestResult('/api/test/projects', 'GET', response.status, response.data);
    } catch (err) {
      const errorMsg = 'Get projects failed: ' + err.message;
      setError(errorMsg);
      addTestResult('/api/test/projects', 'GET', err.response?.status || 'Error', null, errorMsg);
    }
    setLoading(false);
  };

  // Тест создания разработчика
  const testCreateDeveloper = async () => {
    setLoading(true);
    setError(null);
    try {
      const newDev = {
        name: "Test Dev " + Date.now(),
        email: `test${Date.now()}@example.com`,
        skills: ["React", "Testing"],
        years_experience: 3
      };

      const response = await axios.post('/api/test/developers', newDev);
      addTestResult('/api/test/developers', 'POST', response.status, response.data);
      alert('Developer created: ' + response.data.name);
    } catch (err) {
      const errorMsg = 'Create developer failed: ' + err.message;
      setError(errorMsg);
      addTestResult('/api/test/developers', 'POST', err.response?.status || 'Error', null, errorMsg);
    }
    setLoading(false);
  };

  // Автоматически тестируем ping при загрузке
  useEffect(() => {
    testPing();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            borderRadius: '4px'
          }}
        >
          ← Назад на главную
        </Link>
      </div>

      <h1>🧪 API Test Page</h1>

      {loading && <p style={{ color: '#007bff' }}>⏳ Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>

        {/* Ping Test */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3>🏓 Ping Test</h3>
          <button
            onClick={testPing}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Ping
          </button>
          {pingResult && (
            <pre style={{ background: '#f8f9fa', padding: '10px', marginTop: '10px', fontSize: '12px' }}>
              {JSON.stringify(pingResult, null, 2)}
            </pre>
          )}
        </div>

        {/* Developers Tests */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3>👥 Developers</h3>
          <button
            onClick={testGetDevelopers}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Get Developers
          </button>
          <button
            onClick={testCreateDeveloper}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Developer
          </button>
          {developers.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Found {developers.length} developers:</strong>
              {developers.slice(0, 3).map(dev => (
                <div key={dev.id} style={{ background: '#f8f9fa', margin: '5px 0', padding: '8px', fontSize: '12px' }}>
                  <strong>{dev.name}</strong> - {dev.skills?.join(', ')}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects Test */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h3>📁 Projects</h3>
          <button
            onClick={testGetProjects}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Get Projects
          </button>
          {projects.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong>Found {projects.length} projects:</strong>
              {projects.slice(0, 3).map(project => (
                <div key={project.id} style={{ background: '#f8f9fa', margin: '5px 0', padding: '8px', fontSize: '12px' }}>
                  <strong>{project.title}</strong> - {project.status}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Test Results Log */}
      <div>
        <h2>📋 Test Results Log</h2>
        <button
          onClick={() => setTestResults([])}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          Clear Log
        </button>

        {testResults.length === 0 ? (
          <p>No tests run yet</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {testResults.map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  backgroundColor: result.error ? '#f8d7da' : '#d4edda'
                }}
              >
                <div style={{ marginBottom: '5px' }}>
                  <strong>{result.method} {result.endpoint}</strong> -
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    Status: {result.status}
                  </span> -
                  <span style={{ marginLeft: '10px', color: '#666' }}>
                    {result.timestamp}
                  </span>
                </div>
                {result.data && (
                  <pre style={{
                    fontSize: '11px',
                    background: '#f8f9fa',
                    padding: '8px',
                    margin: '5px 0',
                    maxHeight: '150px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
                {result.error && (
                  <p style={{ color: '#721c24', margin: '5px 0', fontSize: '14px' }}>
                    Error: {result.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;