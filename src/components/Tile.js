import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tile = ({ value, isNew, isCombined }) => {
  // Dynamically determine tile color based on value
  const getTileColor = (value) => {
    switch (value) {
      case 2:
        return '#eee4da';
      case 4:
        return '#ede0c8';
      case 8:
        return '#f2b179';
      case 16:
        return '#f59563';
      case 32:
        return '#f67c5f';
      case 64:
        return '#f65e3b';
      case 128:
        return '#edcf72';
      case 256:
        return '#edcc61';
      case 512:
        return '#edc850';
      case 1024:
        return '#edc53f';
      case 2048:
        return '#edc22e';
      default:
        return '#cdc1b4'; // For empty tiles
    }
  };

  return (
    <View style={[styles.tile, { backgroundColor: getTileColor(value) }]}>
      {value > 0 && <Text style={styles.tileText}>{value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#776e65',
  },
});

export default Tile;
