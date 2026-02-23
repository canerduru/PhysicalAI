import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { RepairStep } from '../types';
import { theme } from '../theme';
import * as Speech from 'expo-speech';

type StepChecklistScreenRouteProp = RouteProp<RootStackParamList, 'StepChecklist'>;

export const StepChecklistScreen = () => {
  const route = useRoute<StepChecklistScreenRouteProp>();
  const { job } = route.params;

  const [steps, setSteps] = useState<RepairStep[]>(job.steps);
  const [speakingStepId, setSpeakingStepId] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    setSteps(currentSteps =>
      currentSteps.map(step =>
        step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
      )
    );
  };

  const playVoice = (step: RepairStep) => {
    Speech.stop();
    setSpeakingStepId(step.id);
    Speech.speak(step.voiceText, {
        onDone: () => setSpeakingStepId(null),
        onStopped: () => setSpeakingStepId(null),
    });
  };

  const renderItem = ({ item, index }: { item: RepairStep; index: number }) => {
    const isNext = !item.isCompleted && (index === 0 || steps[index - 1].isCompleted);

    return (
      <View style={[
          styles.stepCard,
          isNext && styles.activeStepCard,
          item.isCompleted && styles.completedStepCard
      ]}>
        <View style={styles.stepHeader}>
            <TouchableOpacity onPress={() => toggleStep(item.id)} style={styles.checkboxContainer}>
                <Text style={styles.checkbox}>{item.isCompleted ? '✅' : '⬜'}</Text>
            </TouchableOpacity>
            <Text style={[
                styles.stepTitle,
                isNext && styles.activeStepTitle,
                item.isCompleted && styles.completedStepTitle
            ]}>
                Step {index + 1}
            </Text>
             <TouchableOpacity onPress={() => playVoice(item)} style={styles.speakerButton}>
                <Text style={styles.speakerIcon}>{speakingStepId === item.id ? '🔊...' : '🔊'}</Text>
            </TouchableOpacity>
        </View>

        <Text style={[
            styles.stepText,
             item.isCompleted && styles.completedStepText
        ]}>
            {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={steps}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  stepCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeStepCard: {
    borderColor: theme.colors.primary,
    backgroundColor: '#E6F0FF', // Light blue
  },
  completedStepCard: {
    opacity: 0.7,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  checkboxContainer: {
    marginRight: theme.spacing.sm,
  },
  checkbox: {
    fontSize: 24,
  },
  stepTitle: {
    ...theme.typography.h3,
    flex: 1,
  },
  activeStepTitle: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  completedStepTitle: {
    textDecorationLine: 'line-through',
    color: theme.colors.textLight,
  },
  speakerButton: {
    padding: theme.spacing.sm,
  },
  speakerIcon: {
    fontSize: 24,
  },
  stepText: {
    ...theme.typography.body,
    marginLeft: 34, // Align with title
  },
  completedStepText: {
    color: theme.colors.textLight,
  },
});
