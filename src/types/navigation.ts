import { Job } from './index';

export type RootStackParamList = {
  MainTabs: undefined;
  JobDashboard: undefined;
  History: undefined;
  Stats: undefined;
  VisionMode: { job: Job };
  StepChecklist: { job: Job };
  JobComplete: { job: Job, sessionData: any };
};
