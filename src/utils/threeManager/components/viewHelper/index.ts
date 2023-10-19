import {
	OrthographicCamera,
	PerspectiveCamera,
} from 'three';
import { ViewHelper as ViewHelperBase } from "./baseViewHelper";
import { CameraControls } from "../cameraControl";

class ViewHelper extends ViewHelperBase {

  private panel: HTMLElement | undefined;

  constructor(editorCamera: PerspectiveCamera | OrthographicCamera, container: HTMLElement, cameraControls: CameraControls) {
    super(editorCamera, container, cameraControls);

    this.panel = document.createElement("div");
    this.panel.style.cssText = `position: absolute; bottom: 0; right: 0; z-index: 33; width: 128px; height: 128px`;
    container.style.position = "relative";
    container.appendChild(this.panel);

    this.panel.addEventListener("pointerup", this.onPointerup.bind(this));
    this.panel.addEventListener("pointerdown", this.onPointerdown.bind(this));
  }

  onPointerup(event: MouseEvent): void {
    event.stopPropagation();
    // event.preventDefault();
    this.handleClick(event);
  }

  onPointerdown(event: MouseEvent): void {
    event.stopPropagation();
  }
}

export { ViewHelper };
