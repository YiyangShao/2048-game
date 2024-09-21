import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Game from './src/components/Game';  // Assuming this is the correct path to Game.js

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Game />
    </GestureHandlerRootView>
  );
}
