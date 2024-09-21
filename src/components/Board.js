import React from 'react';
import { View, StyleSheet } from 'react-native';
import Tile from './Tile';

const Board = ({ board }) => {
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

const styles = StyleSheet.create({
  boardContainer: {
    marginTop: 20,
    width: 320,
    height: 320,
    backgroundColor: '#bbada0',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Board;
