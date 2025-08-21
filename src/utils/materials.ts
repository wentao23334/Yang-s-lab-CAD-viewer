// import * as THREE from 'three'; // Removed as it was unused directly

// Helper to check if a material is our highlight material
export const isHighlightMaterial = (material: any) => {
    return material.emissive?.getHexString() === 'ffff00';
}

// Predefined material presets
export const materialPresets = [
  { name: 'Silicon', color: '#808080', metalness: 0.5, roughness: 0.3, opacity: 1.0 },
  { name: 'PEEK', color: '#B4A58D', metalness: 0.3, roughness: 1.0, opacity: 1.0 },
  { name: 'Graphite', color: '#303030', metalness: 0.2, roughness: 0.7, opacity: 1.0 },
  { name: 'Stainless Steel', color: '#C0C0C0', metalness: 1, roughness: 0.5, opacity: 1.0 },
  { name: 'Green Rubber', color: '#008000', metalness: 0.0, roughness: 0.8, opacity: 1.0 },
  { name: 'PTFE', color: '#FFFFFF', metalness: 0.0, roughness: 0.9, opacity: 1.0 },
  { name: 'Glass', color: '#C0C0C0', metalness: 0.1, roughness: 0.1, opacity: 0.5 },
  { name: 'Copper', color: '#B87333', metalness: 0.9, roughness: 0.3, opacity: 1.0 },
  { name: 'Gold', color: '#FFD700', metalness: 1.0, roughness: 0.2, opacity: 1.0 },
];
