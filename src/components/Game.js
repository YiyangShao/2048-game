import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Tile from './Tile';
import { GameOverModal, GameWonModal } from './Modals';
import {
  moveLeft, moveRight, moveUp, moveDown, addRandomTile,
  checkForWin, checkForGameOver
} from '../utils/boardUtils';

const { width } = Dimensions.get('window');
const boardSize = Math.min(width * 0.9, 320);

const Game = () => {
  const [board, setBoard] = useState(() => {
    let initialBoard = [
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    ];
    initialBoard = addRandomTile(initialBoard);
    return addRandomTile(initialBoard);
  });

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const restartGame = () => {
    let newBoard = [
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
    ];
    newBoard = addRandomTile(newBoard);
    setBoard(addRandomTile(newBoard));
    setScore(0); // Reset the score
    setGameOver(false);
    setGameWon(false);
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
        return; // Ignore other directions
    }

    if (newBoard !== board) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);

      if (checkForWin(newBoard)) {
        setGameWon(true);
      } else if (checkForGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board]);

  // Render the game board
  const renderBoard = () => {
    return (
      <View style={styles.boardContainer}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((tile, colIndex) => (
              <Tile 
                key={`${rowIndex}-${colIndex}`}
                value={tile.value}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

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
        {renderBoard()}

        <GameOverModal visible={gameOver} onRestart={restartGame} />
        <GameWonModal visible={gameWon} onRestart={restartGame} />
      </View>
    </PanGestureHandler>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf8ef',
  },
  boardContainer: {
    marginTop: 20,
    width: boardSize,
    height: boardSize,
    backgroundColor: '#bbada0',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    marginVertical: 10,
  },
});

export default Game;
