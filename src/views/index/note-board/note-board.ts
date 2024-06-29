import { CopyPoint } from "@/utils/pixi";
import {
  Application,
  Container,
  Point,
  Rectangle,
  type ApplicationOptions,
} from "pixi.js";
import { ZoomHelper } from "./zoom";

export class NoteBoard extends Application {
  private minZoom = 0.2;
  private maxZoom = 5;

  private OnLoadFn?: () => void;
  private viewClientRect?: DOMRect;
  private viewContainer: HTMLCanvasElement;

  private isTouchBlank: boolean = false;
  private mouseDownPoint: Point = new Point(0, 0);
  private rootContainerOriginalPos: Point = new Point(0, 0);

  private rootContainer = new Container();

  private zoomHelper: ZoomHelper | undefined;

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

    this.zoomHelper = new ZoomHelper({
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      container: this.viewContainer,
      viewRect: this.viewClientRect,
      zoomContainer: this.rootContainer,
    });

    this.stage.eventMode = "static";
    this.rootContainer.eventMode = "static";
    this.stage.addChild(this.rootContainer);

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

  SetSize(width: number, height: number) {
    this.renderer.resize(width, height);
    this.stage.hitArea = new Rectangle(0, 0, width, height);
    this.viewClientRect = (
      this.viewContainer as HTMLCanvasElement
    ).getBoundingClientRect();
    this.zoomHelper?.SetViewClientRect(this.viewClientRect);
  }

  OnLoad(fn: () => void) {
    this.OnLoadFn = fn;
  }
}
