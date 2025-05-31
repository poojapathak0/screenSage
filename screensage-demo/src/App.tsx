import React, { useState, useEffect } from 'react';
import './App.css';

interface ScreenTimeData {
  [key: string]: number;
}

interface PetStats {
  happiness: number;
  health: number;
  energy: number;
}

const ScreenSageDemo: React.FC = () => {
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [petStats, setPetStats] = useState<PetStats>({
    happiness: 75,
    health: 80,
    energy: 60
  });
  const [currentView, setCurrentView] = useState<'home' | 'stats' | 'pet' | 'social'>('home');

  // Generate mock screen time data
  useEffect(() => {
    const mockData: ScreenTimeData = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      mockData[dateString] = Math.floor(Math.random() * 8 + 2) * 60; // 2-10 hours in minutes
    }
    setScreenTimeData(mockData);
  }, []);

  const getTodayScreenTime = () => {
    const today = new Date().toDateString();
    return Math.round((screenTimeData[today] || 0) / 60);
  };

  const getWeeklyAverage = () => {
    const values = Object.values(screenTimeData);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.round(average / 60);
  };

  const renderChart = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      values.push(Math.round((screenTimeData[dateString] || 0) / 60));
    }

    const maxValue = Math.max(...values) || 1;

    return (
      <div className="chart-container">
        <h3>Weekly Screen Time (Hours)</h3>
        <div className="chart">
          {days.map((day, index) => (
            <div key={day} className="chart-bar">
              <div 
                className="bar" 
                style={{ 
                  height: `${(values[index] / maxValue) * 100}%`,
                  backgroundColor: values[index] > 6 ? '#ef4444' : values[index] > 4 ? '#f59e0b' : '#10b981'
                }}
              ></div>
              <span className="bar-label">{day}</span>
              <span className="bar-value">{values[index]}h</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPet = () => {
    const petEmoji = petStats.happiness > 70 ? '😊' : petStats.happiness > 40 ? '😐' : '😢';
    
    return (
      <div className="pet-container">
        <div className="pet-avatar">
          <div className="pet-face">{petEmoji}</div>
          <div className="pet-body">🐾</div>
        </div>
        <div className="pet-stats">
          <div className="stat">
            <span>Happiness</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${petStats.happiness}%`, backgroundColor: '#f59e0b' }}></div>
            </div>
            <span>{petStats.happiness}%</span>
          </div>
          <div className="stat">
            <span>Health</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${petStats.health}%`, backgroundColor: '#10b981' }}></div>
            </div>
            <span>{petStats.health}%</span>
          </div>
          <div className="stat">
            <span>Energy</span>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${petStats.energy}%`, backgroundColor: '#3b82f6' }}></div>
            </div>
            <span>{petStats.energy}%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="home-view">
      <div className="summary-cards">
        <div className="card">
          <h3>Today's Screen Time</h3>
          <div className="big-number">{getTodayScreenTime()}h</div>
          <p className="card-subtitle">Target: 6h</p>
        </div>
        <div className="card">
          <h3>Weekly Average</h3>
          <div className="big-number">{getWeeklyAverage()}h</div>
          <p className="card-subtitle">Last week: {getWeeklyAverage() + 1}h</p>
        </div>
        <div className="card">
          <h3>Pet Status</h3>
          <div className="pet-mini">
            {petStats.happiness > 70 ? '😊' : petStats.happiness > 40 ? '😐' : '😢'}
          </div>
          <p className="card-subtitle">Happiness: {petStats.happiness}%</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <button className="action-btn focus">🎯 Focus Mode</button>
        <button className="action-btn break">☕ Take Break</button>
        <button className="action-btn challenge">🏆 New Challenge</button>
      </div>

      <div className="ai-insights">
        <h3>🤖 AI Insights</h3>
        <div className="insight">
          <p>You spend most time on social media between 2-4 PM. Consider scheduling a focus session during this time.</p>
        </div>
        <div className="insight">
          <p>Your screen time decreased by 15% this week! Your pet is getting happier 😊</p>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="stats-view">
      {renderChart()}
      <div className="app-usage">
        <h3>Top Apps Today</h3>
        <div className="app-list">
          <div className="app-item">
            <span className="app-name">📱 Social Media</span>
            <span className="app-time">2h 30m</span>
          </div>
          <div className="app-item">
            <span className="app-name">💼 Work Apps</span>
            <span className="app-time">1h 45m</span>
          </div>
          <div className="app-item">
            <span className="app-name">🎮 Games</span>
            <span className="app-time">1h 15m</span>
          </div>
          <div className="app-item">
            <span className="app-name">📺 Entertainment</span>
            <span className="app-time">45m</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="social-view">
      <h3>🏆 Challenges</h3>
      <div className="challenge-list">
        <div className="challenge active">
          <div className="challenge-header">
            <span>📱 Digital Detox Weekend</span>
            <span className="challenge-progress">2/3 days</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '67%' }}></div>
          </div>
        </div>
        <div className="challenge">
          <div className="challenge-header">
            <span>🧘 Mindful Monday</span>
            <span className="challenge-progress">0/1 days</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
      
      <h3>👥 Friends</h3>
      <div className="friends-list">
        <div className="friend">
          <span>👤 Alex</span>
          <span>4h today</span>
        </div>
        <div className="friend">
          <span>👤 Sam</span>
          <span>6h today</span>
        </div>
        <div className="friend">
          <span>👤 Jordan</span>
          <span>3h today</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>📱 ScreenSage</h1>
        <p>AI-Powered Digital Wellness with Your Pet Companion</p>
      </header>

      <nav className="navigation">
        <button 
          className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          🏠 Home
        </button>
        <button 
          className={`nav-btn ${currentView === 'stats' ? 'active' : ''}`}
          onClick={() => setCurrentView('stats')}
        >
          📊 Stats
        </button>
        <button 
          className={`nav-btn ${currentView === 'pet' ? 'active' : ''}`}
          onClick={() => setCurrentView('pet')}
        >
          🐾 Pet
        </button>
        <button 
          className={`nav-btn ${currentView === 'social' ? 'active' : ''}`}
          onClick={() => setCurrentView('social')}
        >
          👥 Social
        </button>
      </nav>

      <main className="main-content">
        {currentView === 'home' && renderHome()}
        {currentView === 'stats' && renderStats()}
        {currentView === 'pet' && renderPet()}
        {currentView === 'social' && renderSocial()}
      </main>
    </div>
  );
};

export default ScreenSageDemo;
