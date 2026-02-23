import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface AROverlayProps {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  type: 'arrow' | 'circle';
}

export const AROverlay = ({ visible, x, y, label, type }: AROverlayProps) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, { top: `${y * 100}%`, left: `${x * 100}%` }]}>
      {type === 'arrow' ? (
        <Text style={styles.arrow}>⬇️</Text>
      ) : (
        <View style={styles.circle} />
      )}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }], // Approximate centering
  },
  arrow: {
    fontSize: 40,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: theme.colors.success,
    backgroundColor: 'rgba(40, 167, 69, 0.2)',
  },
  labelContainer: {
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  },
  labelText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});
