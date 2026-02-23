import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { mockJobs } from '../data/mockData';
import { Job } from '../types';
import { theme } from '../theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getJobs } from '../utils/storage';

type JobDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'JobDashboard'>;

export const JobDashboardScreen = () => {
  const navigation = useNavigation<JobDashboardScreenNavigationProp>();
  const [activeJobs, setActiveJobs] = useState<Job[]>(mockJobs);

  useFocusEffect(
    useCallback(() => {
      const loadJobs = async () => {
        const completedJobs = await getJobs();
        const completedIds = new Set(completedJobs.map(j => j.id));

        // Filter out completed jobs from mock data
        const remainingJobs = mockJobs.filter(job => !completedIds.has(job.id));
        setActiveJobs(remainingJobs);
      };

      loadJobs();
    }, [])
  );

  const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.pay}>${item.estimatedPay}</Text>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.jobType}>{item.jobType}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VisionMode', { job: item })}
      >
        <Text style={styles.buttonText}>Start Job</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeJobs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No active jobs for today!</Text>
        }
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
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    ...theme.typography.body,
    color: theme.colors.textLight,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  customerName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  pay: {
    ...theme.typography.h3,
    color: theme.colors.success,
  },
  address: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  jobType: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
});
