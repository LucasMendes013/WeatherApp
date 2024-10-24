import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme, mediumTheme } from './src/themes';
import Home from './src/components/Home/index';

function App(): JSX.Element {
  const [themeMode, setThemeMode] = useState('light');

  const backgroundColor = themeMode === 'dark' 
    ? darkTheme.colors.background 
    : themeMode === 'medium' 
    ? mediumTheme.colors.background 
    : lightTheme.colors.background;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ThemeProvider theme={themeMode === 'dark' ? darkTheme : themeMode === 'medium' ? mediumTheme : lightTheme}>
        <StatusBar
          translucent
          backgroundColor="transparent" 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Home setTheme={setThemeMode} />
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
