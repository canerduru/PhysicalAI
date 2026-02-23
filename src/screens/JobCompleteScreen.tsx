import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { JobRecord } from '../types';
import { theme } from '../theme';
import { saveJob } from '../utils/storage';

type JobCompleteScreenRouteProp = RouteProp<RootStackParamList, 'JobComplete'>;
type JobCompleteScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'JobComplete'>;

export const JobCompleteScreen = () => {
  const route = useRoute<JobCompleteScreenRouteProp>();
  const navigation = useNavigation<JobCompleteScreenNavigationProp>();
  const { job, sessionData } = route.params;

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const endTime = Date.now();
  const totalTimeSeconds = Math.round((endTime - sessionData.startTime) / 1000);
  const minutes = Math.floor(totalTimeSeconds / 60);
  const seconds = totalTimeSeconds % 60;

  const handleSubmit = async () => {
    if (rating === 0) {
        Alert.alert("Please Rate", "Please select a star rating to continue.");
        return;
    }

    const jobRecord: JobRecord = {
      id: job.id,
      equipmentModel: job.equipmentInfo || "Unknown Model",
      startedAt: new Date(sessionData.startTime).toISOString(),
      completedAt: new Date(endTime).toISOString(),
      totalTimeSeconds: totalTimeSeconds,
      stepsCompleted: sessionData.stepsCompleted,
      aiQuestionsAsked: sessionData.aiQuestions,
      safetyWarnings: sessionData.safetyWarnings,
      toolDetections: sessionData.toolDetections,
      userRating: rating,
      userComment: comment,
    };

    await saveJob(jobRecord);

    // Navigate back to MainTabs -> Jobs
    // Resetting to MainTabs ensures we don't go back to the checklist
    navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Job Complete!</Text>
      <Text style={styles.subtitle}>{job.equipmentInfo}</Text>

      <View style={styles.statsContainer}>
          <Text style={styles.statText}>⏱️ Time: {minutes}m {seconds}s</Text>
          <Text style={styles.statText}>❓ AI Questions: {sessionData.aiQuestions}</Text>
          <Text style={styles.statText}>⚠️ Safety Warnings: {sessionData.safetyWarnings}</Text>
          <Text style={styles.statText}>🛠️ Tool Help: {sessionData.toolDetections}</Text>
      </View>

      <Text style={styles.ratingLabel}>Rate AI Assistance:</Text>
      <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[styles.star, rating >= star && styles.activeStar]}>{rating >= star ? '★' : '☆'}</Text>
              </TouchableOpacity>
          ))}
      </View>

      <Text style={styles.commentLabel}>Comments (Optional):</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Any issues with the steps?"
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit & Finish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.h3,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xl,
  },
  statsContainer: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  statText: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  ratingLabel: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  star: {
    fontSize: 40,
    color: '#ccc',
    marginHorizontal: theme.spacing.xs,
  },
  activeStar: {
    color: '#FFD700', // Gold
  },
  commentLabel: {
    ...theme.typography.body,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    textAlignVertical: 'top',
    height: 100,
    marginBottom: theme.spacing.xl,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
});
