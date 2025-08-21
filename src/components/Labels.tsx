import { useMemo } from 'react';
import * as THREE from 'three';
import { useViewerStore } from '../state/viewerStore';
import { getCenterPoint } from '../utils/bbox';
import Label from './Label';

export default function Labels() {
  const { meshes, hoveredMeshUuid, currentModel } = useViewerStore();

  // 确保所有 Hooks 在条件渲染之前被调用
  const hoveredMesh = hoveredMeshUuid ? meshes[hoveredMeshUuid] : undefined;

  // 读取 label 文本：优先 userData，再退回 name
  const labelText = useMemo(() => {
    if (!hoveredMesh) return ''; // 移到 useMemo 内部
    const ud = (hoveredMesh.userData || {}) as any;
    const text = ud.label || ud.title || hoveredMesh.name || '';
    return String(text).trim();
  }, [hoveredMesh]);

  // 计算世界坐标的中心点（在矩阵刷新后）
  const center = useMemo(() => {
    if (!hoveredMesh) return new THREE.Vector3(); // 移到 useMemo 内部，返回默认值
    // 确保世界矩阵是最新的
    hoveredMesh.updateWorldMatrix(true, true);
    const c = getCenterPoint(hoveredMesh); // 确认内部是 world 下的 box
    // 可选：将中心点稍微上移，让标签不压在模型里
    const box = new THREE.Box3().setFromObject(hoveredMesh);
    const yOffset = (box.max.y - box.min.y) * 0.15; // 15% 高度
    return new THREE.Vector3(c.x, c.y + yOffset, c.z);
  }, [hoveredMesh]);

  // 现在进行条件渲染
  if (!hoveredMesh || !labelText || labelText.toLowerCase().includes('unnamed')) {
    return null;
  }

  return (
    <group key={`${currentModel}-${hoveredMesh.uuid}`}>
      <Label position={[center.x, center.y, center.z]} text={labelText} />
    </group>
  );
}
