# ScreenSage 🧙‍♂️📱

## AI-Powered Screen Time Management with Gamification

ScreenSage transforms screen time management into an engaging experience using AI predictions and a virtual pet companion that thrives when you meet your digital wellness goals.

### 🚀 Features

- **Smart Screen Time Tracking**: Monitor app usage with intelligent insights
- **AI-Powered Predictions**: Machine learning analyzes patterns to prevent overuse
- **Virtual Pet Companion**: Care for a digital pet that grows with your healthy habits
- **Gamification Elements**: Unlock rewards, compete with friends, and level up
- **Personalized Controls**: Custom limits by app, time, and context
- **Social Challenges**: Team up with friends for collective goals

### 🛠️ Tech Stack

- **Frontend**: React Native (Cross-platform mobile)
- **AI/ML**: TensorFlow.js for pattern recognition
- **Backend**: Node.js with Express
- **Database**: MongoDB for user data
- **Real-time**: Socket.io for social features
- **Charts**: React Native Chart Kit for visualizations

### 📱 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the App**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

### 🏗️ Project Structure

```
screensage/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation setup
│   ├── services/           # API and data services
│   ├── utils/              # Helper functions
│   ├── ai/                 # Machine learning models
│   ├── assets/             # Images, fonts, etc.
│   └── types/              # TypeScript type definitions
├── backend/                # Server-side code
├── docs/                   # Documentation
└── tests/                  # Test files
```

### 🎮 Core Concepts

#### Virtual Pet System
Your digital companion reflects your screen time habits:
- **Healthy usage** = Happy, growing pet
- **Overuse** = Pet becomes tired or sad
- **Achievements** = New pet accessories and abilities

#### AI Predictions
- Learns your usage patterns
- Predicts potential binge sessions
- Sends timely interventions
- Adapts to your schedule and preferences

#### Social Features
- Friend challenges
- Leaderboards
- Pet showcasing
- Team goals

### 🔒 Privacy & Security

- All data encrypted end-to-end
- Local processing for sensitive data
- Optional cloud sync
- GDPR compliant

### 📈 Future Roadmap

- [ ] Advanced AI models
- [ ] Wearable integration
- [ ] Parental controls
- [ ] Mental health insights
- [ ] AR pet interactions

---

**Made with ❤️ for digital wellness**
