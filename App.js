import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Game from './src/components/Game';  // Make sure the path to Game is correct

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Game />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8ef',
  },
});
