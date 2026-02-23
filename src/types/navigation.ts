import { Job } from './index';

export type RootStackParamList = {
  JobDashboard: undefined;
  VisionMode: { job: Job };
  StepChecklist: { job: Job };
};
