import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Model from './Model';
import Labels from './Labels';
import DisplayModeHandler from './DisplayModeHandler';

import CameraManager from './CameraManager';
import { useViewerStore } from '../state/viewerStore';

export default function CanvasScene() {
  const modelBounds = useViewerStore((state) => state.modelBounds);
  const currentModel = useViewerStore((state) => state.currentModel);
  const isGridVisible = useViewerStore((state) => state.isGridVisible);
  const backgroundColor = useViewerStore((state) => state.backgroundColor);

  // Calculate grid position based on model bounds
  const gridPosition = modelBounds 
    ? new THREE.Vector3(modelBounds.getCenter(new THREE.Vector3()).x, modelBounds.min.y, modelBounds.getCenter(new THREE.Vector3()).z)
    : new THREE.Vector3(0, 0, 0);

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 35 }}>
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <Environment preset="city" background={false} />
      {currentModel && <Model />} {/* Only render Model if currentModel is set */}
      <Labels />
      <DisplayModeHandler />
      <CameraManager />
      {isGridVisible && <Grid position={gridPosition} infiniteGrid />}
      <OrbitControls makeDefault />
    </Canvas>
  );
}

