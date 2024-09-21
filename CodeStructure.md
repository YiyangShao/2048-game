# CodeStructure.md

## Project Name: 2048 Game

### Structure:
1. **src/App.js**: The entry point of the Expo project. Sets up safe areas and navigation.
2. **src/components/Game.js**: Handles the core game state and game logic, including restart and move validation.
3. **src/components/Board.js**: Renders the game board and rows of tiles.
4. **src/components/Tile.js**: Renders individual game tiles based on their values.
5. **src/components/Modals.js**: Contains the modal components for game over and game win events.
6. **src/hooks/useSwipeHandler.js**: A custom hook to handle swipe gestures and keyboard inputs.
7. **src/utils/boardUtils.js**: Contains the logic for managing the game board and tile movements.
