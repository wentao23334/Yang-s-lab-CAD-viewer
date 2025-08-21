import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useViewerStore } from '../state/viewerStore';
import { isHighlightMaterial, materialPresets } from '../utils/materials';

// A simple material to highlight selected objects
const highlightMaterial = new THREE.MeshStandardMaterial({
    emissive: 'yellow',
    emissiveIntensity: 0.5,
    toneMapped: false
});

export default function Model() {
  const { 
    setMeshes, 
    selectedMeshUuid, 
    setSelectedMeshUuid, 
    setOriginalMaterials,
    displayMode,
    setModelBounds,
    setHoveredMeshUuid,
    setAvailableModels,
    currentModel,
    modelBounds, // Added modelBounds to dependencies for config loading
  } = useViewerStore();

  console.log('Model component rendering. currentModel:', currentModel); // Debug log

  // Use useGLTF with currentModel
  const gltf = useGLTF(`${import.meta.env.BASE_URL}models/${currentModel}`, `${import.meta.env.BASE_URL}draco/gltf/`);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf]);

  // Fetch available models from models.json
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}models/models.json`);
        if (!response.ok) {
          console.error('Failed to fetch models.json:', response.statusText);
          setAvailableModels([]);
          return;
        }
        const modelNames: string[] = await response.json();
        setAvailableModels(modelNames);

        // Set default currentModel if not already set or if it's invalid
        if (!currentModel || !modelNames.includes(currentModel)) {
          useViewerStore.getState().setCurrentModel(modelNames[0] || '');
        }

      } catch (error) {
        console.error('Error fetching models.json:', error);
        setAvailableModels([]);
      }
    };
    fetchModels();
  }, [setAvailableModels, currentModel]); // currentModel is a dependency because we check its validity here

  // Traverse the model and populate the store with meshes and original materials
  useEffect(() => {
    const meshMap: Record<string, THREE.Mesh> = {};
    const materialMap = new Map<string, THREE.Material>();

    const peekPreset = materialPresets.find(p => p.name === 'PEEK');
    const defaultMaterial = peekPreset ? new THREE.MeshStandardMaterial({
        color: new THREE.Color(peekPreset.color),
        metalness: peekPreset.metalness,
        roughness: peekPreset.roughness,
        opacity: peekPreset.opacity,
    }) : new THREE.MeshStandardMaterial({ color: 0xcccccc });

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshMap[child.uuid] = child;
        materialMap.set(child.uuid, child.material as THREE.Material);

        child.material = defaultMaterial.clone();
        child.material.transparent = defaultMaterial.transparent;
      }
    });
    setMeshes(meshMap);
    setOriginalMaterials(materialMap);

    Object.values(meshMap).forEach((mesh) => {
      useViewerStore.getState().setCurrentMaterial(mesh.uuid, mesh.material as THREE.Material); // Use getState
    });

    const box = new THREE.Box3().setFromObject(scene);
    setModelBounds(box);

  }, [scene, setMeshes, setOriginalMaterials, setModelBounds]); // Removed setCurrentMaterial and currentModel from deps

  // --- NEW useEffect for loading config and applying materials ---
  useEffect(() => {
    // This effect runs when the model is processed (modelBounds is set) or the model selection changes.
    if (!modelBounds || !currentModel) return; // Ensure modelBounds is set, indicating scene processing is done

    const loadConfig = async () => {
      try {
        const configFileName = currentModel.replace('.glb', '.json');
        const response = await fetch(`${import.meta.env.BASE_URL}configs/${configFileName}`);
        if (!response.ok) {
          console.warn(`Config file for ${configFileName} not found. Using default materials.`);
          // TODO: Consider setting an error state in the store for UI feedback
          return;
        }
        const config = await response.json();
        const { meshes } = useViewerStore.getState(); // Get latest meshes from store

        if (config.modelName === currentModel && config.parts) {
          config.parts.forEach((partConfig: { name: string; material: string; }) => {
            const mesh = Object.values(meshes).find(m => m.name === partConfig.name);
            if (mesh) {
              const preset = materialPresets.find(p => p.name === partConfig.material);
              if (preset) {
                const newMaterial = new THREE.MeshStandardMaterial({
                  color: new THREE.Color(preset.color),
                  metalness: preset.metalness,
                  roughness: preset.roughness,
                  opacity: preset.opacity,
                });
                newMaterial.transparent = preset.opacity < 1.0;

                mesh.material = newMaterial;
                useViewerStore.getState().setCurrentMaterial(mesh.uuid, newMaterial); // Use getState for setCurrentMaterial
              } else {
                console.warn(`Material preset "${partConfig.material}" not found for part "${partConfig.name}"`);
              }
            } else {
              console.warn(`Part "${partConfig.name}" not found in model.`);
            }
          });
        }
      } catch (error) {
        console.error('Failed to load or apply model config:', error);
        // TODO: Consider setting an error state in the store for UI feedback
      }
    };

    loadConfig();
  }, [modelBounds, currentModel]); // Depend on modelBounds and currentModel

  // Handle highlighting based on selection, but only in normal mode
  useEffect(() => {
    if (displayMode !== 'normal') return;
    
    const { meshes, currentMaterials } = useViewerStore.getState(); // Get latest state

    for (const mesh of Object.values(meshes)) {
      const currentMat = currentMaterials.get(mesh.uuid);
      if (!currentMat) continue;

      if (mesh.uuid === selectedMeshUuid) {
        if (mesh.material === currentMat) { // Only apply highlight if not already highlighted
            mesh.material = highlightMaterial;
        }
      } else {
        if (isHighlightMaterial(mesh.material)) { // Only revert if currently highlighted
            mesh.material = currentMat;
        }
      }
    }
    return () => {
        // Cleanup function: revert highlight when component unmounts or dependencies change
        if(selectedMeshUuid) {
            const { meshes, currentMaterials } = useViewerStore.getState();
            const mesh = meshes[selectedMeshUuid];
            if(mesh && isHighlightMaterial(mesh.material)) {
                const originalMat = currentMaterials.get(selectedMeshUuid);
                if (originalMat) {
                    mesh.material = originalMat;
                }
            }
        }
    }
  }, [selectedMeshUuid, displayMode]); // Dependencies updated

  // C. 切换模型时重置悬停/选中
  useEffect(() => {
    // currentModel 变化就清空 hover/选中
    setHoveredMeshUuid(null);
    setSelectedMeshUuid(null);
  }, [currentModel, setHoveredMeshUuid, setSelectedMeshUuid]);

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (event.object instanceof THREE.Mesh) {
      setSelectedMeshUuid(event.object.uuid);
    }
  };

  const handleMiss = () => {
    setSelectedMeshUuid(null);
  }

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    if (event.object instanceof THREE.Mesh) {
      setHoveredMeshUuid(event.object.uuid);
      console.log('Hovered mesh UUID:', event.object.uuid, 'Name:', event.object.name); // Debug log
    }
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    setHoveredMeshUuid(null);
    console.log('Hovered mesh cleared.'); // Debug log
  };

  return <primitive 
            object={scene} 
            key={currentModel} /* ★ 强制在模型切换时卸载+重建 */
            onClick={handleClick} 
            onPointerMissed={handleMiss} /* ★ 修正事件名 */
            onPointerOver={handlePointerOver} 
            onPointerOut={handlePointerOut}
          />;
}