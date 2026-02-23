import { Job, DiagnosticQuestion } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    address: '123 Maple Dr, Springfield',
    jobType: 'AC not cooling',
    estimatedPay: 450,
    equipmentInfo: 'Carrier 24ACC6',
    issueDescription: 'Diagnosing...',
    steps: [
       // Default steps if no diagnosis needed, or post-diagnosis
    ],
    diagnosticTree: {
      id: 'q1',
      text: 'Is the outdoor fan running?',
      options: [
        {
          label: 'Yes',
          nextStepId: 'q2'
        },
        {
          label: 'No',
          finalDiagnosis: 'Bad Capacitor',
          steps: [
            {
              id: 's1',
              text: 'Turn off power at disconnect',
              isCompleted: false,
              voiceText: 'Safety first. Pull the disconnect handle to cut power.'
            },
            {
              id: 's2',
              text: 'Open access panel',
              isCompleted: false,
              voiceText: 'Remove the screws to access the electrical components.'
            },
             {
              id: 's3',
              text: 'Check capacitor',
              isCompleted: false,
              voiceText: 'Locate the silver cylinder. Check if the top is bulging.'
            }
          ]
        }
      ]
    }
  },
  {
    id: '2',
    customerName: 'Bob Smith',
    address: '456 Oak Ln, Centerville',
    jobType: 'Furnace not heating',
    estimatedPay: 300,
    equipmentInfo: 'Trane XR95',
    issueDescription: 'Faulty igniter',
    steps: [
      {
        id: 's1',
        text: 'Turn off gas and power',
        isCompleted: false,
        voiceText: 'Turn off the gas valve and the electrical switch on the side of the furnace.'
      },
      {
        id: 's2',
        text: 'Remove burner cover',
        isCompleted: false,
        voiceText: 'Remove the screws holding the burner cover in place to expose the igniter assembly.'
      },
      {
        id: 's3',
        text: 'Inspect igniter',
        isCompleted: false,
        voiceText: 'Look for a crack in the ceramic element of the igniter. If cracked, it needs replacement.'
      }
    ]
  },
  {
    id: '3',
    customerName: 'Charlie Brown',
    address: '789 Pine St, Hill Valley',
    jobType: 'Regular Maintenance',
    estimatedPay: 150,
    equipmentInfo: 'Lennox XC21',
    issueDescription: 'Routine Checkup',
    steps: [
      {
        id: 's1',
        text: 'Check filter',
        isCompleted: false,
        voiceText: 'Inspect the air filter. If it is dirty, recommend a replacement to the homeowner.'
      },
      {
        id: 's2',
        text: 'Clean condenser coils',
        isCompleted: false,
        voiceText: 'Spray the condenser coils with water to remove dust and debris for better efficiency.'
      }
    ]
  }
];

// Mock Diagnostic Question Lookup (since nested objects in JSON are hard to traverse recursively without a map in a real DB)
export const mockQuestions: Record<string, DiagnosticQuestion> = {
  'q2': {
    id: 'q2',
    text: 'Is the compressor making a loud noise?',
    options: [
      {
        label: 'Yes, grinding',
        finalDiagnosis: 'Compressor Failure',
        steps: [
          {
            id: 'c1',
            text: 'Verify voltage to compressor',
            isCompleted: false,
            voiceText: 'Check if the compressor is receiving 240 volts.'
          },
          {
            id: 'c2',
            text: 'Check amperage',
            isCompleted: false,
            voiceText: 'Measure the current draw. If it is locked rotor amps, the compressor is seized.'
          }
        ]
      },
      {
        label: 'No, just humming',
        finalDiagnosis: 'Hard Start Kit Needed',
        steps: [
             {
            id: 'h1',
            text: 'Install hard start kit',
            isCompleted: false,
            voiceText: 'Wire in a hard start capacitor to assist the compressor startup.'
          }
        ]
      }
    ]
  }
};
