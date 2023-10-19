import { Space } from '@/utils';

import { OrthographicCamera, PerspectiveCamera } from 'three';

const setSize = (space: Space) => {
  const {
    camera,
    renderer,
    rendererCSS2D,
    rendererCSS3D,
    container,
    effectManager,
    effectComposer,
  } = space;
  const { width, height } = container.getBoundingClientRect();

  const aspect = width / height;
  if (camera instanceof PerspectiveCamera) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }
  if (camera instanceof OrthographicCamera) {
    camera.left = (width / 2) * aspect;
    camera.right = (width / 2) * aspect;
    camera.top = (height / 2) * aspect;
    camera.bottom = (-height / 2) * aspect;
    camera.updateProjectionMatrix();
  }

  rendererCSS2D.setSize(width, height);
  rendererCSS3D.setSize(width, height);
  renderer.setSize(width, height);
  effectManager.updateCamera(camera);
  effectComposer.setSize(width, height);
};

class Resizer {
  constructor(readonly space: Space) {
    // set initial size

    setSize(space);

    window.addEventListener('resize', () => {
      this.onResize(space);
    });
  }

  onResize(space: Space) {
    const { camera, renderer, scene, rendererCSS2D, rendererCSS3D } = space;
    setSize(space);

    rendererCSS2D.render(scene, camera);
    rendererCSS3D.render(scene, camera);

    renderer.render(scene, camera);
    this.space.effectComposer.render();
    // perform any custom actions

    //custom actions
  }
  dispose() {
    window.removeEventListener(
      'resize',
      this.onResize.bind(this, this.space),
      false
    );
  }
}

export { Resizer };
