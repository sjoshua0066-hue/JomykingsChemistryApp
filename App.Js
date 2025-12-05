import 'react-native-gesture-handler';
import React from 'react';
// These imports are for managing the app screens and moving between them
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens (These files don't exist yet, but we define their names here)
import HomeScreen from './screens/Home';
import ElementsScreen from './screens/Elements';
import NotesScreen from './screens/Notes';
import PeriodicTableScreen from './screens/PeriodicTable';
// Placeholder for the Reactions screen, which we will build later
import PlaceholderScreen from './screens/Placeholder'; 

// We'll use a simple Stack Navigator for moving between screens
const Stack = createStackNavigator();

const App = () => {
  return (
    // NavigationContainer holds the entire navigation tree of the app
    <NavigationContainer>
      {/* Stack Navigator manages screen history (push/pop) */}
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff', // Jomy Kings Blue header background
          },
          headerTintColor: '#fff', // White text for the header title
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
        {/* Define the Home Screen */}
        <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Jomy Kings Chemistry App' }}
        />
        {/* Define the Elements Screen */}
        <Stack.Screen 
            name="Elements" 
            component={ElementsScreen} 
            options={{ title: 'Elements Explorer' }}
        />
        {/* Define the Notes Screen */}
        <Stack.Screen 
            name="Notes" 
            component={NotesScreen} 
            options={{ title: 'Quick Notes & Reader' }}
        />
        {/* Define the Periodic Table Screen */}
        <Stack.Screen 
            name="PeriodicTable" 
            component={PeriodicTableScreen} 
            options={{ title: 'Interactive Periodic Table' }}
        />
        {/* Define the Reactions Screen (Placeholder) */}
        <Stack.Screen 
            name="Reactions" 
            component={PlaceholderScreen} 
            options={{ title: 'Reaction Balancer (Coming Soon)' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
