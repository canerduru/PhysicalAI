export interface RepairStep {
  id: string;
  text: string;
  isCompleted: boolean;
  voiceText: string; // The text that will be spoken
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    nextStepId?: string; // ID of the next question
    finalDiagnosis?: string; // If this answer leads to a diagnosis
    steps?: RepairStep[]; // If diagnosis, provide repair steps
  }[];
}

export interface Job {
  id: string;
  customerName: string;
  address: string;
  jobType: string;
  estimatedPay: number;
  equipmentInfo?: string; // e.g. "Carrier 24ACC6"
  issueDescription?: string; // e.g. "Bad capacitor"
  steps: RepairStep[];
  diagnosticTree?: DiagnosticQuestion; // Initial question
}

export interface AROverlayData {
  visible: boolean;
  x: number; // 0-1 percentage of width
  y: number; // 0-1 percentage of height
  label: string;
  type: 'arrow' | 'circle';
}

export interface ToolDetectionData {
  visible: boolean;
  toolName: string;
  isCorrect: boolean;
  message: string;
}

export interface SafetyWarningData {
  visible: boolean;
  message: string;
}
