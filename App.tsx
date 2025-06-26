import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { signUp, signIn, signOut, onAuthStateChange } from './supabase/supabaseConfig';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddHabitScreen from './screens/AddHabitScreen';

// Admin credentials for local development
const ADMIN_EMAIL = 'Admin@Admin.com';
const ADMIN_PASSWORD = 'Admins';

type RootStackParamList = {
  Login: {
    adminEmail: string;
    adminPassword: string;
    onAdminLogin: () => void;
  };
  Home: {
    isAdmin: boolean;
  };
  AddHabit: {
    onSave: (habitData: any) => Promise<void>;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Let LoginScreen handle loading
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn || isAdmin ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              initialParams={{ isAdmin }}
            />
            <Stack.Screen name="AddHabit" component={AddHabitScreen} />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            initialParams={{ 
              adminEmail: ADMIN_EMAIL, 
              adminPassword: ADMIN_PASSWORD,
              onAdminLogin: () => {
                setIsAdmin(true);
                setIsLoggedIn(true);
              }
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 