import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ToolDetectionOverlayProps {
  visible: boolean;
  toolName: string;
  isCorrect: boolean;
  message: string;
}

export const ToolDetectionOverlay = ({ visible, toolName, isCorrect, message }: ToolDetectionOverlayProps) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{isCorrect ? '✅' : '❌'}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.toolName}>{toolName}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  textContainer: {
    flexDirection: 'column',
  },
  toolName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  message: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
});
