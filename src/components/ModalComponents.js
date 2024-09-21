import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const GameOverModal = ({ visible, restartGame }) => (
  <Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Game Over!</Text>
        <TouchableOpacity onPress={restartGame} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const WinModal = ({ visible, restartGame }) => (
  <Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Congratulations! You won!</Text>
        <TouchableOpacity onPress={restartGame} style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
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
