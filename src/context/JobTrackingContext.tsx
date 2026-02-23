import React, { createContext, useContext, useState } from 'react';

interface JobSession {
  jobId: string;
  startTime: number; // timestamp
  aiQuestions: number;
  safetyWarnings: number;
  toolDetections: number;
  stepsCompleted: number;
}

interface JobTrackingContextType {
  currentSession: JobSession | null;
  startJob: (jobId: string) => void;
  incrementAiQuestions: () => void;
  incrementSafetyWarnings: () => void;
  incrementToolDetections: () => void;
  incrementStepsCompleted: () => void;
  endJob: () => JobSession | null;
}

const JobTrackingContext = createContext<JobTrackingContextType | undefined>(undefined);

export const JobTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<JobSession | null>(null);

  const startJob = (jobId: string) => {
    setCurrentSession({
      jobId,
      startTime: Date.now(),
      aiQuestions: 0,
      safetyWarnings: 0,
      toolDetections: 0,
      stepsCompleted: 0,
    });
  };

  const incrementAiQuestions = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, aiQuestions: currentSession.aiQuestions + 1 });
    }
  };

  const incrementSafetyWarnings = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, safetyWarnings: currentSession.safetyWarnings + 1 });
    }
  };

  const incrementToolDetections = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, toolDetections: currentSession.toolDetections + 1 });
    }
  };

  const incrementStepsCompleted = () => {
      if (currentSession) {
          setCurrentSession({...currentSession, stepsCompleted: currentSession.stepsCompleted + 1});
      }
  }

  const endJob = () => {
    const session = currentSession;
    setCurrentSession(null);
    return session;
  };

  return (
    <JobTrackingContext.Provider
      value={{
        currentSession,
        startJob,
        incrementAiQuestions,
        incrementSafetyWarnings,
        incrementToolDetections,
        incrementStepsCompleted,
        endJob,
      }}
    >
      {children}
    </JobTrackingContext.Provider>
  );
};

export const useJobTracking = () => {
  const context = useContext(JobTrackingContext);
  if (!context) {
    throw new Error('useJobTracking must be used within a JobTrackingProvider');
  }
  return context;
};
