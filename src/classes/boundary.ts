import { checkMove } from "../utils/collisions";
import { RECT_WIDTH, RECT_HEIGHT } from "../utils/constants";
import { BoundaryProps } from "../utils/interfaces";
import { context } from "./canvas";

class Boundary {
  props: BoundaryProps;
  constructor({pos, width = RECT_WIDTH, height = RECT_HEIGHT, velocity = 3, moveable = false, type }: BoundaryProps) {
    this.props = { pos, width, height, velocity, moveable, type };
  }

  public draw(): void {
    if (this.props && context) {
      context.fillStyle = 'rgba(255, 0, 0, .5)';
      context.fillRect(
        this.props.pos.x, 
        this.props.pos.y, 
        (this.props.width || RECT_WIDTH), 
        (this.props.height || RECT_HEIGHT)
      );

      checkMove(this);
    }
  }
}

export default Boundary;