import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Frontend App</h1>
      <p>Добро пожаловать в основное приложение!</p>

      <nav style={{ marginTop: '30px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link
              to="/apitest"
              style={{
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '5px',
                display: 'inline-block'
              }}
            >
              🧪 API Tests
            </Link>
          </li>
          <li style={{ marginTop: '10px' }}>
            <a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '5px',
                display: 'inline-block'
              }}
            >
              ⚙️ Admin Panel
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;