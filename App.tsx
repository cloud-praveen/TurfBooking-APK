import './src/global.css';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { HomeScreen } from './src/screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { OtpVerificationScreen } from './src/screens/OtpVerificationScreen';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <OtpVerificationScreen />
      </SafeAreaProvider>
    </Provider>
  );
}
