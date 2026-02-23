# PhysicalAI - AI Coach for HVAC Technicians

PhysicalAI is a React Native mobile application designed to assist HVAC technicians on the job. It uses AI vision and voice guidance to identify equipment, diagnose issues, and provide step-by-step repair instructions, all while keeping the technician's hands free.

## Features

### Phase 1: Core Assistance
- **Job Dashboard:** View today's assigned jobs with customer details and equipment info.
- **AI Vision Mode:** Point your camera at equipment to identify the model and issue.
- **Voice Guidance:** Hear step-by-step instructions via text-to-speech.
- **Interactive Checklist:** Mark steps as complete and listen to instructions for each step.

### Phase 2: Advanced Safety & Guidance
- **Real-Time Safety Warnings:** Simulated alerts when dangerous conditions (like live electricity) are detected.
- **AR Visual Guidance:** Augmented reality-style overlays pointing to specific components (e.g., "Capacitor here").
- **Tool Detection:** AI confirmation that you are holding the correct tool for the job.
- **Diagnostic Branching:** Intelligent question-and-answer flow to narrow down issues before starting repairs.

### Phase 3: Analytics & History
- **Job History:** Automatically logs completed jobs with duration and details.
- **Performance Stats:** Track your average repair time, safety compliance, and most common repairs.
- **User Feedback:** Rate the AI's helpfulness after each job to improve future guidance.

## Tech Stack
- **Framework:** React Native with Expo (TypeScript)
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **Camera:** Expo Camera
- **Voice:** Expo Speech (Text-to-Speech)
- **Storage:** AsyncStorage (Local persistence)

## Installation & Running

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the App:**
   ```bash
   npx expo start
   ```

3. **Run on Device/Simulator:**
   - Press `i` to run on iOS Simulator.
   - Press `a` to run on Android Emulator.
   - Scan the QR code with the Expo Go app on your physical device.

## Screenshots

*(Screenshots to be added)*
