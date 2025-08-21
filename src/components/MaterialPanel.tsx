import React, { useEffect, useState } from 'react';
import { useViewerStore } from '../state/viewerStore';
import * as THREE from 'three';
import { isHighlightMaterial, materialPresets } from '../utils/materials';

export default function MaterialPanel() {
  const { selectedMeshUuid, meshes, originalMaterials, setCurrentMaterial } = useViewerStore();
  const selectedMesh = selectedMeshUuid ? meshes[selectedMeshUuid] : null;

  const [color, setColor] = useState('#ffffff');
  const [metalness, setMetalness] = useState(0);
  const [roughness, setRoughness] = useState(0);
  const [opacity, setOpacity] = useState(1.0);

  useEffect(() => {
    if (selectedMesh) {
      const materialToShow = isHighlightMaterial(selectedMesh.material)
        ? originalMaterials.get(selectedMesh.uuid)
        : selectedMesh.material;

      if (materialToShow) {
        const mat = materialToShow as THREE.MeshStandardMaterial;
        setColor('#' + mat.color.getHexString());
        setMetalness(mat.metalness || 0);
        setRoughness(mat.roughness || 0);
        setOpacity(mat.opacity || 1.0);
      }
    }
  }, [selectedMesh, originalMaterials]);

  const applyMaterialProperties = (newColor: string, newMetalness: number, newRoughness: number, newOpacity: number) => {
    if (!selectedMesh) return;

    const baseMaterial = isHighlightMaterial(selectedMesh.material)
      ? originalMaterials.get(selectedMesh.uuid)
      : selectedMesh.material;

    if (!baseMaterial) return;

    // Clone the material if it's the original one or the highlight material
    if (selectedMesh.material === originalMaterials.get(selectedMesh.uuid) || isHighlightMaterial(selectedMesh.material)) {
      selectedMesh.material = (baseMaterial as THREE.Material).clone();
    }

    const mat = selectedMesh.material as THREE.MeshStandardMaterial;

    mat.color.set(newColor);
    mat.metalness = newMetalness;
    mat.roughness = newRoughness;
    mat.opacity = newOpacity;
    mat.transparent = newOpacity < 1.0; // Enable transparency if opacity is less than 1
    mat.needsUpdate = true;

    // Update current material in store
    setCurrentMaterial(selectedMesh.uuid, mat);

    setColor(newColor);
    setMetalness(newMetalness);
    setRoughness(newRoughness);
    setOpacity(newOpacity);
  };

  const handleMaterialChange = (prop: 'color' | 'metalness' | 'roughness' | 'opacity', value: any) => {
    if (!selectedMesh) return;

    let newColor = color;
    let newMetalness = metalness;
    let newRoughness = roughness;
    let newOpacity = opacity;

    switch (prop) {
      case 'color':
        newColor = value;
        break;
      case 'metalness':
        newMetalness = parseFloat(value);
        break;
      case 'roughness':
        newRoughness = parseFloat(value);
        break;
      case 'opacity':
        newOpacity = parseFloat(value);
        break;
    }
    applyMaterialProperties(newColor, newMetalness, newRoughness, newOpacity);
  };

  const handleRestoreDefault = () => {
    if (!selectedMesh) return;
    const originalMat = originalMaterials.get(selectedMesh.uuid);
    if (originalMat) {
      selectedMesh.material = originalMat;
      const mat = originalMat as THREE.MeshStandardMaterial;
      setColor('#' + mat.color.getHexString());
      setMetalness(mat.metalness || 0);
      setRoughness(mat.roughness || 0);
      setOpacity(mat.opacity || 1.0);
    }
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPresetName = event.target.value;
    const preset = materialPresets.find(p => p.name === selectedPresetName);
    if (preset) {
      applyMaterialProperties(preset.color, preset.metalness, preset.roughness, preset.opacity);
    }
  };

  const styles = {
    label: { margin: '10px 0 5px 0', display: 'block' },
    input: { width: '100%', boxSizing: 'border-box' as 'border-box' },
    button: { width: '100%', padding: '8px', marginTop: '15px', cursor: 'pointer' },
    select: { width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' as 'border-box' },
  };

  return (
    <div>
      <h4>Material Editor</h4>
      {!selectedMesh ? (
        <p>Select a part to edit its material.</p>
      ) : (
        <div>
          <div>
            <label style={styles.label}>Material Presets</label>
            <select onChange={handlePresetChange} style={styles.select} defaultValue="">
              <option value="" disabled>Select a preset</option>
              {materialPresets.map(preset => (
                <option key={preset.name} value={preset.name}>{preset.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={styles.label}>Color</label>
            <input 
              type="color" 
              value={color}
              onChange={(e) => handleMaterialChange('color', e.target.value)} 
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Metalness: {metalness.toFixed(2)}</label>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={metalness}
              onChange={(e) => handleMaterialChange('metalness', e.target.value)} 
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Roughness: {roughness.toFixed(2)}</label>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={roughness}
              onChange={(e) => handleMaterialChange('roughness', e.target.value)} 
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Opacity: {opacity.toFixed(2)}</label>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={opacity}
              onChange={(e) => handleMaterialChange('opacity', e.target.value)} 
              style={styles.input}
            />
          </div>
          <button onClick={handleRestoreDefault} style={styles.button}>Restore Default</button>
        </div>
      )}
    </div>
  );
}