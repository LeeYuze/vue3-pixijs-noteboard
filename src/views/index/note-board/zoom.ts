import { Point, type Container } from "pixi.js";

type IZoomHelper = {
  minZoom: number;
  maxZoom: number;
  viewRect?: DOMRect;
  zoomContainer: Container;
  container: HTMLCanvasElement;
};

export class ZoomHelper {
  private rootContainer: Container;
  private viewClientRect?: DOMRect;
  private viewContainer: HTMLCanvasElement;
  private minZoom = 0.2;
  private maxZoom = 5;

  constructor(options: IZoomHelper) {
    this.viewClientRect = options.viewRect;
    this.rootContainer = options.zoomContainer;
    this.viewContainer = options.container;
    this.minZoom = options.minZoom;
    this.maxZoom = options.maxZoom;

    (this.viewContainer as HTMLCanvasElement).addEventListener(
      "wheel",
      (e: WheelEvent) => {
        if (!this.viewClientRect) return;

        const { x, y } = this.viewClientRect;
        const globalPos = new Point(e.clientX - x, e.clientY - y);
        const delta = e.deltaY;
        const oldZoom = this.GetZoom();
        let newZoom = oldZoom * 0.999 ** delta;
        if (newZoom > this.maxZoom) newZoom = this.maxZoom;
        if (newZoom < this.minZoom) newZoom = this.minZoom;
        this.ApplyZoom(oldZoom, newZoom, globalPos);
      }
    );
  }

  GetZoom(): number {
    // stage是宽高等比例缩放的，所以取x或者取y是一样的
    return this.rootContainer.scale.x;
  }

  ApplyZoom(oldZoom: number, newZoom: number, pointerGlobalPos: Point) {
    const oldStageMatrix = this.rootContainer.localTransform.clone();
    const oldStagePos = oldStageMatrix.applyInverse(pointerGlobalPos);
    const dx = oldStagePos.x * oldZoom - oldStagePos.x * newZoom;
    const dy = oldStagePos.y * oldZoom - oldStagePos.y * newZoom;

    this.rootContainer.updateTransform({
      x: this.rootContainer.position.x + dx,
      y: this.rootContainer.position.y + dy,
      scaleX: newZoom,
      scaleY: newZoom,
    });
  }

  SetViewClientRect(rect: DOMRect) {
    this.viewClientRect = rect;
  }
}
