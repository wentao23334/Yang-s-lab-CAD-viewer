import { create } from 'zustand';
import * as THREE from 'three';

export type DisplayMode = 'normal' | 'isolated' | 'xray';

interface ViewerState {
  meshes: Record<string, THREE.Mesh>;
  setMeshes: (meshes: Record<string, THREE.Mesh>) => void;

  selectedMeshUuid: string | null;
  setSelectedMeshUuid: (uuid: string | null) => void;

  originalMaterials: Map<string, THREE.Material>;
  setOriginalMaterials: (materials: Map<string, THREE.Material>) => void;

  currentMaterials: Map<string, THREE.Material>;
  setCurrentMaterial: (uuid: string, material: THREE.Material) => void;

  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;

  modelBounds: THREE.Box3 | null;
  setModelBounds: (bounds: THREE.Box3) => void;

  hoveredMeshUuid: string | null;
  setHoveredMeshUuid: (uuid: string | null) => void;

  availableModels: string[];
  setAvailableModels: (models: string[]) => void;

  currentModel: string;
  setCurrentModel: (model: string) => void;

  isGridVisible: boolean;
  toggleGrid: () => void;

  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  meshes: {},
  setMeshes: (meshes) => set({ meshes }),

  selectedMeshUuid: null,
  setSelectedMeshUuid: (uuid) => set({ selectedMeshUuid: uuid }),

  originalMaterials: new Map(),
  setOriginalMaterials: (materials) => set({ originalMaterials: materials }),

  currentMaterials: new Map(),
  setCurrentMaterial: (uuid, material) => set((state) => ({
    currentMaterials: new Map(state.currentMaterials).set(uuid, material)
  })),

  displayMode: 'normal',
  setDisplayMode: (mode) => set({ displayMode: mode }),

  modelBounds: null,
  setModelBounds: (bounds) => set({ modelBounds: bounds }),

  hoveredMeshUuid: null,
  setHoveredMeshUuid: (uuid) => set({ hoveredMeshUuid: uuid }),

  availableModels: [],
  setAvailableModels: (models) => set({ availableModels: models }),

  currentModel: 'IR H-Cell.glb', // Default model
  setCurrentModel: (model) => set({ currentModel: model }),

  isGridVisible: true,
  toggleGrid: () => set((state) => ({ isGridVisible: !state.isGridVisible })),

  backgroundColor: '#ffffff',
  setBackgroundColor: (color) => set({ backgroundColor: color }),
}));
