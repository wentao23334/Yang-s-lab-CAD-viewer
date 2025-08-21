import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useViewerStore } from '../state/viewerStore';
import * as THREE from 'three';

export default function CameraManager() {
  const { controls } = useThree();
  const orbitControls = controls as any;
  const modelBounds = useViewerStore((state) => state.modelBounds);

  useEffect(() => {
    if (modelBounds && controls) {
      const center = new THREE.Vector3();
      modelBounds.getCenter(center);

      // On first load of a model, move the camera to a good viewing position
      const offset = orbitControls.object.position.clone().sub(orbitControls.target).normalize().multiplyScalar(10); // Keep current zoom distance
      const newCamPos = center.clone().add(offset);
      
      orbitControls.object.position.copy(newCamPos);
      orbitControls.target.copy(center);
      orbitControls.update();
    }
    // We only want this to run once when the modelBounds are first set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelBounds]);

  return null;
}
