import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0066CC',
    secondary: '#E31837',
    surface: '#ffffff',
    background: '#f5f5f5',
    onSurface: '#000000',
    onSurfaceVariant: '#666666',
    outline: '#cccccc',
  },
};

export default function App() {
  return (
    <View style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <TabNavigator />
            <StatusBar style="dark" />
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
