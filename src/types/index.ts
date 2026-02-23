export interface RepairStep {
  id: string;
  text: string;
  isCompleted: boolean;
  voiceText: string; // The text that will be spoken
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
}
