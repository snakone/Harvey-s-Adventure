const canvas: HTMLCanvasElement = document.querySelector('#game') as HTMLCanvasElement;
const context = canvas.getContext('2d');

export const DEFAULT_WIDTH = 1024;
export const DEFAULT_HEIGHT = 576;
canvas.width = DEFAULT_WIDTH;
canvas.height = DEFAULT_HEIGHT;

context?.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

export { canvas, context }