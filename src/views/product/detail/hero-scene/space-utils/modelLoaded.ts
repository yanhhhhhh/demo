import { Color, Object3D } from 'three';
import { createPoiNodeElements } from './sprite';
import { spaceHeroId, spaceStore } from '@/utils';

export const heroSceneCallback = ({
  object,
  padding,
  distance,
}: {
  object: Object3D;
  padding: number;
  distance: number;
}) => {
  const space = spaceStore.get(spaceHeroId);
  if (!space) return;
  space.scene.background = new Color(0xcccccc);
  space.getAmbientLight().intensity = 2;
  space.cameraControls.fitToBox(object, true, {
    cover: false,
    paddingLeft: padding,
    paddingRight: padding,
    paddingBottom: padding,
    paddingTop: padding,
  });
  space.cameraControls.distance = distance;
  space.cameraControls.minDistance = distance;
  space.cameraControls.maxDistance = distance;
  space.cameraControls.maxPolarAngle = Math.PI / 2;
  space.cameraControls.azimuthAngle = Math.PI / 2 + Math.PI / 5;
  space.cameraControls.polarAngle = (Math.PI / 10) * 3;

  createPoiNodeElements(space, object);
};
