import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobRecord } from '../types';

const STORAGE_KEY = '@physical_ai_jobs';

export const saveJob = async (job: JobRecord) => {
  try {
    const existingJobs = await getJobs();
    const updatedJobs = [...existingJobs, job];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
  } catch (e) {
    console.error('Failed to save job', e);
  }
};

export const getJobs = async (): Promise<JobRecord[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch jobs', e);
    return [];
  }
};

export const clearJobs = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch(e) {
        console.error('Failed to clear jobs', e);
    }
}
