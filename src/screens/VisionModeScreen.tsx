import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { theme } from '../theme';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VisionModeScreenRouteProp = RouteProp<RootStackParamList, 'VisionMode'>;
type VisionModeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VisionMode'>;

export const VisionModeScreen = () => {
  const route = useRoute<VisionModeScreenRouteProp>();
  const navigation = useNavigation<VisionModeScreenNavigationProp>();
  const { job } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  useEffect(() => {
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
         }
      }, 5000);

    }, 2000);

    return () => {
        clearTimeout(timer);
        Speech.stop();
    };
  }, []);

  const handleMicPress = () => {
    // Stop current speech
    Speech.stop();

    // Simulate asking "Which wire goes where?"
    setAiMessage("Listening...");

    setTimeout(() => {
      // Mock response
      const response = "The red wire connects to the C terminal on the left. I can see it in your image.";
      setAiMessage(response);
      Speech.speak(response);
    }, 1500);
  };

  if (!permission) {
    // Camera permissions are still loading.
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

          {detected && (
            <View style={styles.detectedOverlay}>
               <Text style={styles.detectedText}>{job.equipmentInfo}</Text>
            </View>
          )}

          {/* Bottom Control Panel */}
          <View style={styles.bottomControls}>
            {/* AI Message Area */}
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
  }
});
