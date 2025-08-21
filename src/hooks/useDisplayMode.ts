import { useEffect } from 'react';
import * as THREE from 'three';
import { useViewerStore } from '../state/viewerStore';

// A shared material for X-Ray mode
const xrayMaterial = new THREE.MeshStandardMaterial({
  color: '#007bff',
  opacity: 0.3,
  transparent: true,
  depthWrite: false, // Important for seeing things inside
});

export function useDisplayMode() {
  const { displayMode, selectedMeshUuid } = useViewerStore();

  useEffect(() => {
    // This effect handles visibility and material swapping for different modes
    const { meshes, currentMaterials } = useViewerStore.getState();

    for (const mesh of Object.values(meshes)) {
      const isSelected = mesh.uuid === selectedMeshUuid;
      const currentMat = currentMaterials.get(mesh.uuid);

      if (!currentMat) continue;

      // --- Always restore to current material first ---
      // This ensures that when switching modes, meshes revert to their actual state
      mesh.material = currentMat;
      mesh.visible = true; // Always start visible, then hide if isolated

      // Apply mode-specific overrides
      switch (displayMode) {
        case 'isolated':
          // Only the selected mesh is visible
          if (!isSelected) {
            mesh.visible = false;
          }
          break;

        case 'xray':
          // Non-selected meshes get the xray material
          if (!isSelected) {
            mesh.material = xrayMaterial;
          }
          break;

        case 'normal':
        default:
          // No special overrides needed, already restored to currentMat and visible
          break;
      }
    }
    // By depending only on user actions, we avoid re-running this complex logic on every render.
    // We get the latest mesh/material data from the store directly inside the effect.
  }, [displayMode, selectedMeshUuid]);
}
