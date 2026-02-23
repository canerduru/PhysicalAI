import { Job } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    address: '123 Maple Dr, Springfield',
    jobType: 'AC not cooling',
    estimatedPay: 450,
    equipmentInfo: 'Carrier 24ACC6',
    issueDescription: 'Bad capacitor',
    steps: [
      {
        id: 's1',
        text: 'Turn off power at the disconnect box',
        isCompleted: false,
        voiceText: 'First, locate the disconnect box near the unit and pull the handle to cut the power. Safety first.'
      },
      {
        id: 's2',
        text: 'Open the access panel',
        isCompleted: false,
        voiceText: 'Use your nut driver to remove the screws on the access panel and set it aside.'
      },
      {
        id: 's3',
        text: 'Discharge the capacitor',
        isCompleted: false,
        voiceText: 'Using an insulated screwdriver, bridge the terminals on the capacitor to discharge any stored energy.'
      },
      {
        id: 's4',
        text: 'Check capacitance',
        isCompleted: false,
        voiceText: 'Set your multimeter to capacitance mode and measure the reading across the terminals. It should be within 5% of the rating.'
      },
      {
        id: 's5',
        text: 'Replace if faulty',
        isCompleted: false,
        voiceText: 'If the reading is out of range, unstrap the old capacitor and wire in the new one, matching the terminals exactly.'
      }
    ]
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
