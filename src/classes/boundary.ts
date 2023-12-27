import { OFFSET_X, OFFSET_Y } from "../lib/sprites";
import { keys } from "../listerners/keyboard";
import { BoundaryProps } from "../utils/interfaces";
import { context } from "./canvas";

export const RECT_WIDTH = 48;
export const RECT_HEIGHT = 48;

class Boundary {
  props: BoundaryProps;
  constructor({pos, width = RECT_WIDTH, height = RECT_HEIGHT, offset = {x: 0, y: 0}}: BoundaryProps) {
    this.props = { pos, width, height, offset };
  }

  public draw(): void {
    if (this.props && context) {
      context.fillStyle = 'rgba(255, 0, 0, .5)';
      context.fillRect(
        this.props.pos.x + (this.props.offset ? this.props.offset.x : OFFSET_X), 
        this.props.pos.y + (this.props.offset ? this.props.offset.y : OFFSET_Y), 
        (this.props.width || RECT_WIDTH), 
        (this.props.height || RECT_HEIGHT)
      );

      if (keys.w && keys.lastKey === 'w') this.props.pos.y += 3;
      else if (keys.a && keys.lastKey === 'a') this.props.pos.x += 3;
      else if (keys.d && keys.lastKey === 'd') this.props.pos.x -= 3;
      else if (keys.s && keys.lastKey === 's') this.props.pos.y -= 3;
    }
  }
}

export default Boundary;