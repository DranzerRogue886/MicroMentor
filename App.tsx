import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './types';
import HomeScreen from './screens/HomeScreen';
import AddHabitScreen from './screens/AddHabitScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    // Request notification permissions on app start
    const requestPermissions = async () => {
      try {
        const { NotificationService } = await import('./services/notifications');
        await NotificationService.requestPermissions();
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };

    requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddHabit" component={AddHabitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 