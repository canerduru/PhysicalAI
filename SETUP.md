# Setup & Testing Guide

This guide explains how to set up the PhysicalAI development environment and test the simulated AI features.

## Prerequisites

- **Node.js** (LTS version recommended)
- **Expo CLI:** `npm install -g expo-cli`
- **Xcode (Mac only)** for iOS Simulator or **Android Studio** for Android Emulator.
- **Expo Go App** on your physical iOS/Android device (if testing on real hardware).

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd physical-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the App

1. **Start the development server:**
   ```bash
   npx expo start
   ```

2. **Choose your platform:**
   - Press `i` to open in the iOS Simulator.
   - Press `a` to open in the Android Emulator.
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android) to run on a physical device.

## Testing Simulated Features

Since the backend AI integration is mocked for this MVP, we have included a "Dev Menu" to simulate real-world scenarios.

### 1. Vision Mode & AI Detection
   - Navigate to **"Today's Jobs"** (Dashboard).
   - Tap **"Start Job"** on any job card.
   - The camera view will open. Wait a few seconds for the "Scanning..." simulation to complete.
   - The AI will announce the equipment model and issue.

### 2. Simulated Safety & Tools (Dev Menu)
   - In **Vision Mode**, look for the **"🛠️ Dev"** button in the top-right corner.
   - Tap it to open the Simulation Controls:
     - **⚠️ Trigger Safety Warning:** Simulates detecting a live wire. Screen turns red, and a warning voice plays. You must tap "I turned off power" to continue.
     - **📍 Show Capacitor Location:** Simulates AR guidance. An arrow will point to a specific spot on the screen.
     - **✅ Detect Multimeter:** Simulates the AI recognizing the correct tool.
     - **❌ Detect Wrench:** Simulates the AI recognizing the *wrong* tool and correcting you.

### 3. Diagnostic Branching
   - Select a job that requires diagnosis (e.g., "AC not cooling").
   - Tap **"Checklist"**.
   - Instead of a list of steps, you will see a question (e.g., "Is the fan running?").
   - Answer the question to see the logic branch to the next step or a final diagnosis.

### 4. Job Completion & History
   - Complete all steps in the checklist.
   - The app will automatically navigate to the **Job Complete** screen.
   - Rate the AI and submit feedback.
   - Go to the **"History"** tab to see your completed job log.
