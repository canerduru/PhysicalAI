import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobDashboardScreen } from './src/screens/JobDashboardScreen';
import { VisionModeScreen } from './src/screens/VisionModeScreen';
import { StepChecklistScreen } from './src/screens/StepChecklistScreen';
import { RootStackParamList } from './src/types/navigation';
import { theme } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="JobDashboard"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="JobDashboard"
          component={JobDashboardScreen}
          options={{ title: "Today's Jobs" }}
        />
        <Stack.Screen
          name="VisionMode"
          component={VisionModeScreen}
          options={{ title: 'AI Vision Mode', headerShown: false }}
        />
        <Stack.Screen
          name="StepChecklist"
          component={StepChecklistScreen}
          options={{ title: 'Repair Checklist' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
