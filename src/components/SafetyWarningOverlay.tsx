import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

interface SafetyWarningOverlayProps {
  visible: boolean;
  onDismiss: () => void;
}

export const SafetyWarningOverlay = ({ visible, onDismiss }: SafetyWarningOverlayProps) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>DANGER: Live Electricity Detected</Text>
        <Text style={styles.message}>Turn off breaker before proceeding.</Text>

        <TouchableOpacity style={styles.button} onPress={onDismiss}>
          <Text style={styles.buttonText}>I turned off power</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 53, 69, 0.9)', // Red overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  message: {
    ...theme.typography.h2,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.error,
  },
});
