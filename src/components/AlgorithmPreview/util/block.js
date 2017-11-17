import { memoize } from '../../../util';

const BLOCK_SIZE = 10;
const SATURATION = 100;
const LIGHTNESS = 50;

const getColorFromHue = hue =>
  ['hsl(', [hue, `${SATURATION}%`, `${LIGHTNESS}%`].join(', '), ')'].join('');

const getHueFromHsl = hsl => parseInt(hsl.match(/hsl\((\d+)/).pop(), 10);

const randomColor = () => {
  const randomNum = num => Math.floor(Math.random() * num);
  const hue = randomNum(360);
  return getColorFromHue(hue);
};

const colorCache = memoize(numColors =>
  new Array(numColors).fill(undefined).map(() => randomColor())
);

export const createBlock = context => color => (...args) => {
  const [x, y, height, width = height] = args;
  context.fillStyle = color;
  context.clearRect(x, y, width, height);
  context.fillRect(x, y, width, height);
  return getHueFromHsl(color);
};

export const createRow = context => ({ width, blockSize, y = 0 }) => {
  let blocks = [];
  const numBlocks = Math.ceil(width / blockSize);
  const colors = colorCache(numBlocks + 1).slice(0);
  for (let i = 0; i < numBlocks; i++) {
    const color = colors
      .splice(Math.floor(Math.random() * colors.length), 1)
      .pop();
    blocks.push(createBlock(context)(color)(i * blockSize, y, blockSize));
  }
  return blocks;
};

export const createGrid = context => ({
  height,
  width,
  blockSize = BLOCK_SIZE
}) => {
  let grid = [];
  let row = 0;
  while (row * blockSize <= height) {
    grid.push(createRow(context)({ width, blockSize, y: row * blockSize }));
    row += 1;
  }
  return grid;
};

export const updateRow = context => (row, rowIndex) => {
  return row.map((block, i) => {
    const { color, x, y, height, width } = block;
    return createBlock(context)(color)(
      i * BLOCK_SIZE,
      rowIndex * BLOCK_SIZE,
      height,
      width
    );
  });
};

export const updateRowAtPosition = context => (rowIndex, blockIndex, hue) => {
  return createBlock(context)(getColorFromHue(hue))(
    blockIndex * BLOCK_SIZE,
    rowIndex * BLOCK_SIZE,
    BLOCK_SIZE,
    BLOCK_SIZE
  );
};