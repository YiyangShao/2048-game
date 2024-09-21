import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Board from './Board';
import { GameOverModal, WinModal } from './ModalComponents';
import { moveLeft, moveRight, moveUp, moveDown } from './MoveFunctions';

const Game = () => {
  const [board, setBoard] = useState(() => {
    const [board, setBoard] = useState(() => {
      let initialBoard = [
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      ];
      initialBoard = addRandomTile(initialBoard);  // Add random tile at the start
      return addRandomTile(initialBoard);  // Add a second random tile at the start
    });
  });

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const restartGame = () => {
    // Restart game logic
  };

  const handleMove = useCallback((direction) => {
    let newBoard;
    const updateScore = (points) => setScore(prevScore => prevScore + points);

    switch (direction) {
      case 'left':
        newBoard = moveLeft(board, updateScore);
        break;
      case 'right':
        newBoard = moveRight(board, updateScore);
        break;
      case 'up':
        newBoard = moveUp(board, updateScore);
        break;
      case 'down':
        newBoard = moveDown(board, updateScore);
        break;
      default:
        return;
    }

    // Add additional logic for checking win or game over
  }, [board]);

  // Handle keyboard input for web platform
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          handleMove('left');
          break;
        case 'ArrowRight':
          handleMove('right');
          break;
        case 'ArrowUp':
          handleMove('up');
          break;
        case 'ArrowDown':
          handleMove('down');
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMove]);

  return (
    <PanGestureHandler
      onGestureEvent={(event) => {
        if (event.nativeEvent.translationX > 50) handleMove('right');
        else if (event.nativeEvent.translationX < -50) handleMove('left');
        else if (event.nativeEvent.translationY > 50) handleMove('down');
        else if (event.nativeEvent.translationY < -50) handleMove('up');
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>2048 Game</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <Board board={board} />

        {/* Game Over and Win Modals */}
        <GameOverModal visible={gameOver} restartGame={restartGame} />
        <WinModal visible={gameWon} restartGame={restartGame} />
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf8ef',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    marginVertical: 10,
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: '#8f7a66',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Game;
