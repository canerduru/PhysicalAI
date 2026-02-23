import React from 'react';
import { JobTrackingProvider } from './src/context/JobTrackingContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { JobDashboardScreen } from './src/screens/JobDashboardScreen';
import { VisionModeScreen } from './src/screens/VisionModeScreen';
import { StepChecklistScreen } from './src/screens/StepChecklistScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { JobCompleteScreen } from './src/screens/JobCompleteScreen';
import { RootStackParamList } from './src/types/navigation';
import { theme } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.primary },
                headerTintColor: theme.colors.white,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Jobs" component={JobDashboardScreen} options={{ title: "Today's Jobs" }} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
  return (
    <NavigationContainer>
      <JobTrackingProvider>
        <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
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
            <Stack.Screen
            name="JobComplete"
            component={JobCompleteScreen}
            options={{ title: 'Job Complete', headerLeft: () => null }}
            />
        </Stack.Navigator>
      </JobTrackingProvider>
    </NavigationContainer>
  );
}
