import * as THREE from 'three';

export function getCenterPoint(mesh: THREE.Mesh): THREE.Vector3 {
  const geometry = mesh.geometry;
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }
  const center = new THREE.Vector3();
  geometry.boundingBox!.getCenter(center);
  mesh.localToWorld(center);
  return center;
}
