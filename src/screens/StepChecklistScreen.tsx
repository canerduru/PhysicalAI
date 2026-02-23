import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RepairStep, DiagnosticQuestion } from '../types';
import { theme } from '../theme';
import { mockQuestions } from '../data/mockData';
import * as Speech from 'expo-speech';
import { useJobTracking } from '../context/JobTrackingContext';

type StepChecklistScreenRouteProp = RouteProp<RootStackParamList, 'StepChecklist'>;
type StepChecklistScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StepChecklist'>;

export const StepChecklistScreen = () => {
  const route = useRoute<StepChecklistScreenRouteProp>();
  const navigation = useNavigation<StepChecklistScreenNavigationProp>();
  const { job } = route.params;

  const { incrementStepsCompleted, currentSession, endJob } = useJobTracking();

  const [currentQuestion, setCurrentQuestion] = useState<DiagnosticQuestion | null>(job.diagnosticTree || null);
  const [diagnosis, setDiagnosis] = useState<string | null>(job.issueDescription || null);
  const [steps, setSteps] = useState<RepairStep[]>(job.steps || []);
  const [speakingStepId, setSpeakingStepId] = useState<string | null>(null);

  useEffect(() => {
    // If we start with a question, speak it
    if (currentQuestion) {
        Speech.speak(currentQuestion.text);
    }
  }, [currentQuestion]);

  // Check if all steps are completed
  useEffect(() => {
      if (steps.length > 0 && steps.every(s => s.isCompleted)) {
          // All done!
          const session = endJob(); // This clears the session but returns the data
          if (session) {
              // Navigate to JobComplete
              navigation.navigate('JobComplete', { job, sessionData: session });
          }
      }
  }, [steps]);

  const handleAnswer = (option: { label: string; nextStepId?: string; finalDiagnosis?: string; steps?: RepairStep[] }) => {
    Speech.stop();
    if (option.finalDiagnosis) {
      setDiagnosis(option.finalDiagnosis);
      setSteps(option.steps || []);
      setCurrentQuestion(null);
      Speech.speak(`Diagnosis: ${option.finalDiagnosis}. Proceeding with repair steps.`);
    } else if (option.nextStepId) {
      const nextQ = mockQuestions[option.nextStepId];
      if (nextQ) {
        setCurrentQuestion(nextQ);
      } else {
         // Fallback if ID missing
         setDiagnosis("Unknown Issue");
         setCurrentQuestion(null);
      }
    } else {
       // Leaf node with no steps?
       setCurrentQuestion(null);
    }
  };

  const toggleStep = (id: string) => {
    setSteps(currentSteps => {
      const newSteps = currentSteps.map(step =>
        step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
      );

      const changedStep = newSteps.find(s => s.id === id);
      if (changedStep && changedStep.isCompleted) {
          incrementStepsCompleted();
      }
      return newSteps;
    });
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

  if (currentQuestion) {
      return (
          <View style={styles.container}>
              <View style={styles.diagnosticContainer}>
                  <Text style={styles.diagnosticTitle}>Diagnostic Mode</Text>
                  <Text style={styles.questionText}>{currentQuestion.text}</Text>

                  <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.optionButton}
                            onPress={() => handleAnswer(option)}
                        >
                            <Text style={styles.optionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                  </View>
              </View>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      {diagnosis && (
          <View style={styles.diagnosisBanner}>
              <Text style={styles.diagnosisText}>Diagnosis: {diagnosis}</Text>
          </View>
      )}
      <FlatList
        data={steps}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No repair steps available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  diagnosticContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
  },
  diagnosticTitle: {
      ...theme.typography.h2,
      color: theme.colors.primary,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
  },
  questionText: {
      ...theme.typography.h3,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
      gap: theme.spacing.md,
  },
  optionButton: {
      backgroundColor: theme.colors.cardBackground,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
  },
  optionText: {
      ...theme.typography.button,
      color: theme.colors.primary,
  },
  diagnosisBanner: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      alignItems: 'center',
  },
  diagnosisText: {
      color: theme.colors.white,
      fontWeight: 'bold',
      fontSize: 18,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  emptyText: {
      textAlign: 'center',
      marginTop: theme.spacing.xl,
      ...theme.typography.body,
      color: theme.colors.textLight,
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
