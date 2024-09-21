# CodeStructure.md

## Project Name: 2048 Game

### Overview
This project is a React Native implementation of the 2048 game, integrated into Mike's personal website.

### Structure:
1. **App.js**: The entry point of the Expo project.
   - **Description**: Imports and renders the `Game` component. Sets up the safe area and container for the app.

2. **src/components/Game.js**: Main game logic and UI.
   - **Description**: Implements the game logic, handles swipe gestures, and includes the modals for win/game over.

3. **src/components/Board.js**: Handles rendering the board, including rows and tiles.
   - **Description**: Takes the board state and renders each tile based on its value.

4. **src/components/MoveFunctions.js**: Contains movement logic for sliding tiles.
   - **Description**: Defines the movement functions for left, right, up, and down movements, including tile merging and sliding logic.

5. **src/components/ModalComponents.js**: Contains the game-over and win modals.
   - **Description**: Renders modals when the game ends or the player wins.
