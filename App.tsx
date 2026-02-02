import './src/global.css';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';

const linking = {
  prefixes: ['turfbooking://', 'https://turfbooking.com'],
  config: {
    screens: {
      LiveScoreView: 'live/:matchId',
    },
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
