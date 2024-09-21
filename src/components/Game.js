import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Tile from './Tile';

const { width } = Dimensions.get('window');
const boardSize = Math.min(width * 0.9, 320);

const getRandomPosition = (board) => {
  const emptyTiles = [];
  board.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (tile.value === 0) {
        emptyTiles.push([rowIndex, colIndex]);
      }
    });
  });

  if (emptyTiles.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomIndex];
};

const resetTileStates = (board) => {
  return board.map(row =>
    row.map(tile => ({
      value: tile.value,
      isNew: false,
      isCombined: false,
    }))
  );
};

const addRandomTile = (board) => {
  const position = getRandomPosition(board);
  if (position === null) return board;

  const [row, col] = position;
  const newBoard = [...board];
  newBoard[row][col] = { value: Math.random() < 0.6 ? 2 : 4, isNew: true, isCombined: false };
  return newBoard;
};

const slideAndCombineRow = (row, updateScore) => {
  let arr = row.filter(tile => tile.value); // Filter out all zeros
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value === arr[i + 1].value) { // Combine equal tiles
      arr[i].value *= 2;
      arr[i].isCombined = true;
      updateScore(arr[i].value); // Update the score with the new tile value
      arr[i + 1].value = 0;
    }
  }
  arr = arr.filter(tile => tile.value); // Filter out zeros again after combination
  return [...arr, ...Array(4 - arr.length).fill({ value: 0, isNew: false, isCombined: false })]; // Pad the rest with zeros
};

const moveLeft = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  return newBoard.map(row => slideAndCombineRow(row, updateScore));
};

const moveRight = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  return newBoard.map(row => slideAndCombineRow(row.reverse(), updateScore).reverse());
};

const transpose = (board) => {
  return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
};

const moveUp = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  const transposed = transpose(newBoard);
  const moved = transposed.map(row => slideAndCombineRow(row, updateScore));
  return transpose(moved);
};

const moveDown = (board, updateScore) => {
  const newBoard = resetTileStates(board);
  const transposed = transpose(newBoard);
  const moved = transposed.map(row => slideAndCombineRow(row.reverse(), updateScore).reverse());
  return transpose(moved);
};

const checkForWin = (board) => {
  for (let row of board) {
    if (row.some(tile => tile.value === 2048)) {
      return true;
    }
  }
  return false;
};

const checkForGameOver = (board) => {
  for (let row of board) {
    if (row.some(tile => tile.value === 0)) {
      return false; // There are still empty spaces
    }
  }

  // Check for possible merges horizontally and vertically
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length - 1; j++) {
      if (board[i][j].value === board[i][j + 1].value || (board[j] && board[j][i].value === board[j + 1][i].value)) {
        return false;
      }
    }
  }
  return true; // No more moves available
};

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
        setGameWon(true);  // Open win modal
      } else if (checkForGameOver(newBoard)) {
        setGameOver(true);  // Open game-over modal
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
                isNew={tile.isNew}
                isCombined={tile.isCombined}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

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
        {renderBoard()}

        {/* Game Over and Win Modals */}
        <Modal visible={gameOver} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Game Over!</Text>
              <TouchableOpacity onPress={restartGame} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={gameWon} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Congratulations! You won!</Text>
              <TouchableOpacity onPress={restartGame} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#8f7a66',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Game;
