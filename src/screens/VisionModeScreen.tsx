import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { theme } from '../theme';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafetyWarningOverlay } from '../components/SafetyWarningOverlay';
import { AROverlay } from '../components/AROverlay';
import { ToolDetectionOverlay } from '../components/ToolDetectionOverlay';
import { useJobTracking } from '../context/JobTrackingContext';

type VisionModeScreenRouteProp = RouteProp<RootStackParamList, 'VisionMode'>;
type VisionModeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VisionMode'>;

export const VisionModeScreen = () => {
  const route = useRoute<VisionModeScreenRouteProp>();
  const navigation = useNavigation<VisionModeScreenNavigationProp>();
  const { job } = route.params;

  // Tracking Context
  const { startJob, incrementAiQuestions, incrementSafetyWarnings, incrementToolDetections } = useJobTracking();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // New State for Overlays
  const [safetyVisible, setSafetyVisible] = useState(false);
  const [arVisible, setArVisible] = useState(false);
  const [toolVisible, setToolVisible] = useState(false);
  const [toolData, setToolData] = useState({ toolName: '', isCorrect: false, message: '' });
  const [arData, setArData] = useState({ x: 0.5, y: 0.5, label: '' });
  const [devMenuVisible, setDevMenuVisible] = useState(false);

  useEffect(() => {
    // Start tracking when screen mounts
    startJob(job.id);

    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    // Simulate scanning delay
    const timer = setTimeout(() => {
      setScanning(false);
      setDetected(true);
      const message = `${job.equipmentInfo} detected. ${job.issueDescription}.`;
      setAiMessage(message);
      Speech.speak(message);

      // After intro, speak the first step?
      setTimeout(() => {
         if (job.steps.length > 0) {
             const step1 = job.steps[0];
             const stepMsg = `Step 1. ${step1.voiceText}`;
             setAiMessage(stepMsg);
             Speech.speak(stepMsg);
         } else if (job.diagnosticTree) {
             setAiMessage("Starting diagnostic mode. Please check the checklist.");
         }
      }, 5000);

    }, 2000);

    return () => {
        clearTimeout(timer);
        Speech.stop();
    };
  }, []);

  const handleMicPress = () => {
    Speech.stop();
    setAiMessage("Listening...");
    incrementAiQuestions(); // Track Usage

    setTimeout(() => {
      const response = "The red wire connects to the C terminal on the left. I can see it in your image.";
      setAiMessage(response);
      Speech.speak(response);
    }, 1500);
  };

  // Simulation Handlers
  const triggerSafetyWarning = () => {
      incrementSafetyWarnings(); // Track Usage
      setSafetyVisible(true);
      Speech.stop();
      Speech.speak("STOP! Turn off power first!");
      setDevMenuVisible(false);
  };

  const showMultimeter = () => {
      incrementToolDetections(); // Track Usage
      setToolData({ toolName: 'Multimeter', isCorrect: true, message: 'Ready' });
      setToolVisible(true);
      Speech.speak("I see you have a multimeter, good! Set it to voltage mode.");
      setTimeout(() => setToolVisible(false), 5000);
      setDevMenuVisible(false);
  };

  const showWrench = () => {
      incrementToolDetections(); // Track Usage
      setToolData({ toolName: 'Wrench', isCorrect: false, message: 'Need: Multimeter' });
      setToolVisible(true);
      Speech.speak("That's a wrench, you need a multimeter for this step.");
      setTimeout(() => setToolVisible(false), 5000);
      setDevMenuVisible(false);
  };

  const showCapacitorLocation = () => {
      setArData({ x: 0.6, y: 0.4, label: 'Capacitor here' });
      setArVisible(true);
      Speech.speak("The capacitor is located here.");
      setTimeout(() => setArVisible(false), 5000);
      setDevMenuVisible(false);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { alignItems: 'center', padding: 20 }]}>
        <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 18 }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
            <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          {scanning && (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.scanningText}>Scanning equipment...</Text>
            </View>
          )}

          {detected && !safetyVisible && (
            <View style={styles.detectedOverlay}>
               <Text style={styles.detectedText}>{job.equipmentInfo}</Text>
            </View>
          )}

          <AROverlay visible={arVisible} x={arData.x} y={arData.y} label={arData.label} type="arrow" />
          <ToolDetectionOverlay visible={toolVisible} {...toolData} />
          <SafetyWarningOverlay visible={safetyVisible} onDismiss={() => setSafetyVisible(false)} />

          <TouchableOpacity style={styles.devMenuButton} onPress={() => setDevMenuVisible(true)}>
              <Text style={styles.devMenuText}>🛠️ Dev</Text>
          </TouchableOpacity>

          <View style={styles.bottomControls}>
            <View style={styles.aiMessageContainer}>
               <Text style={styles.aiMessageText}>{aiMessage || "Point camera at equipment"}</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
                  <Text style={styles.micButtonText}>🎤 Ask AI</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checklistButton}
                    onPress={() => {
                        Speech.stop();
                        navigation.navigate('StepChecklist', { job });
                    }}
                >
                  <Text style={styles.checklistButtonText}>Checklist</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal visible={devMenuVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Dev Simulation Controls</Text>

                    <TouchableOpacity style={styles.modalButton} onPress={triggerSafetyWarning}>
                        <Text style={styles.modalButtonText}>⚠️ Trigger Safety Warning</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={showCapacitorLocation}>
                        <Text style={styles.modalButtonText}>📍 Show Capacitor Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={showMultimeter}>
                        <Text style={styles.modalButtonText}>✅ Detect Multimeter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={showWrench}>
                        <Text style={styles.modalButtonText}>❌ Detect Wrench (Wrong Tool)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setDevMenuVisible(false)}>
                        <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  scanningOverlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: theme.colors.overlay,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  scanningText: {
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
    ...theme.typography.h3,
  },
  detectedOverlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 86, 210, 0.8)', // Primary with opacity
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  detectedText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  bottomControls: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: 'auto',
  },
  aiMessageContainer: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.sm,
    minHeight: 60,
    justifyContent: 'center',
  },
  aiMessageText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  micButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  micButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  checklistButton: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  checklistButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  buttonText: {
     color: theme.colors.white,
     textAlign: 'center',
     fontWeight: 'bold',
     fontSize: 18,
  },
  devMenuButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 10,
      borderRadius: 20,
  },
  devMenuText: {
      color: 'white',
      fontWeight: 'bold',
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
  },
  modalButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
  },
  modalButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
  },
});
