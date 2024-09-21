import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Board from './Board';
import { GameOverModal, GameWonModal } from './Modals';
import { useSwipeHandler } from '../hooks/useSwipeHandler';
import {
  moveLeft, moveRight, moveUp, moveDown, addRandomTile,
  checkForWin, checkForGameOver
} from '../utils/boardUtils';

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

    const previousBoard = JSON.parse(JSON.stringify(board));

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

    const boardsAreDifferent = (board1, board2) => {
      return board1.some((row, rowIndex) => 
        row.some((tile, colIndex) => tile.value !== board2[rowIndex][colIndex].value)
      );
    };

    if (boardsAreDifferent(previousBoard, newBoard)) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);

      if (checkForWin(newBoard)) {
        setGameWon(true);
      } else if (checkForGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board]);

  const gestureHandler = useSwipeHandler(handleMove);

  return (
    <PanGestureHandler onHandlerStateChange={gestureHandler}>
      <View style={styles.container}>
        <Text style={styles.title}>2048 Game</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <Board board={board} />

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
