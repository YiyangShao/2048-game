export const slideAndCombineRow = (row, updateScore) => {
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

export const moveLeft = (board, updateScore) => {
  return board.map(row => slideAndCombineRow(row, updateScore));
};

export const moveRight = (board, updateScore) => {
  return board.map(row => slideAndCombineRow(row.reverse(), updateScore).reverse());
};

export const transpose = (board) => {
  return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
};

export const moveUp = (board, updateScore) => {
  const transposed = transpose(board);
  const moved = transposed.map(row => slideAndCombineRow(row, updateScore));
  return transpose(moved);
};

export const moveDown = (board, updateScore) => {
  const transposed = transpose(board);
  const moved = transposed.map(row => slideAndCombineRow(row.reverse(), updateScore).reverse());
  return transpose(moved);
};
