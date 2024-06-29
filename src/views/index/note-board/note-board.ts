import { CopyPoint } from "@/utils/pixi";
import {
  Application,
  Container,
  Point,
  Rectangle,
  type ApplicationOptions,
} from "pixi.js";

export class NoteBoard extends Application {
  private minZoom = 0.2;
  private maxZoom = 5;

  private OnLoadFn?: () => void;
  private viewContainer: Element;
  private viewClientRect?: DOMRect;

  private isTouchBlank: boolean = false;
  private mouseDownPoint: Point = new Point(0, 0);
  private rootContainerOriginalPos: Point = new Point(0, 0);

  private rootContainer = new Container();

  AddChild = this.rootContainer.addChild.bind(this.rootContainer);

  constructor(options?: Partial<ApplicationOptions> & { el: string }) {
    super();
    this.viewContainer = document.querySelector(options!.el)!;
    this.init(options).then(this.Init.bind(this));
  }

  private Init() {
    if (this.viewContainer) {
      this.viewContainer.append(this.canvas);
    }
    if (this.OnLoadFn) {
      this.ticker.addOnce(() => {
        setTimeout(() => {
          this.OnLoadFn?.();
        }, 300);
      });
    }

    this.stage.eventMode = "static";
    this.rootContainer.eventMode = "static";
    this.stage.addChild(this.rootContainer);

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

    this.stage.addEventListener("pointerdown", (e) => {
      this.rootContainerOriginalPos = CopyPoint(this.rootContainer.position);
      this.mouseDownPoint = CopyPoint(e.client);

      // down the blank area
      if (e.target === this.stage) {
        // use to drag canvas
        this.isTouchBlank = true;
      }
    });

    this.stage.addEventListener("pointermove", (e) => {
      const DragCanvas = () => {
        const dx = e.clientX - this.mouseDownPoint.x;
        const dy = e.clientY - this.mouseDownPoint.y;
        this.rootContainer.position.set(
          this.rootContainerOriginalPos.x + dx,
          this.rootContainerOriginalPos.y + dy
        );
      };

      if (this.isTouchBlank) {
        DragCanvas();
      }
    });

    this.stage.addEventListener("pointerup", (e) => {
      this.isTouchBlank = false;
    });
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

  SetSize(width: number, height: number) {
    this.renderer.resize(width, height);
    this.stage.hitArea = new Rectangle(0, 0, width, height);
    this.viewClientRect = (
      this.viewContainer as HTMLCanvasElement
    ).getBoundingClientRect();
  }

  OnLoad(fn: () => void) {
    this.OnLoadFn = fn;
  }
}
