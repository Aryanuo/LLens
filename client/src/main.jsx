import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';

function App() {
  return (
    <main className="starter-card">
      <h1>lablens</h1>
      <p className="tagline">turning confusing lab reports into a clear,personalised care plan</p>
      <div className="guidelines-box">
        <strong>Team:</strong> commit happens!<br />
        <strong>Problem Statement:</strong> 9 in 10 indian adults cannot fully understand their own medical lab reports. patients get a page of jargon and numbers with no explanation of what it means or what to do next-leading to anxiety, ignored red flags, and no follow through on diet, exercise, or lifestyle change.
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
