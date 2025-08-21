import { useState } from 'react';
import { useViewerStore } from '../state/viewerStore';

export default function PartList() {
  const { meshes, selectedMeshUuid, setSelectedMeshUuid } = useViewerStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeshes = Object.values(meshes).filter(mesh =>
    mesh.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4>Parts ({filteredMeshes.length} / {Object.keys(meshes).length})</h4>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '5px', boxSizing: 'border-box', marginBottom: '10px' }}
      />
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid grey', padding: '5px' }}>
        {filteredMeshes.map((mesh) => (
          <div
            key={mesh.uuid}
            onClick={() => setSelectedMeshUuid(mesh.uuid)}
            onDoubleClick={() => console.log('Fit to view not implemented yet')}
            style={{
              padding: '4px',
              margin: '2px 0',
              cursor: 'pointer',
              backgroundColor: selectedMeshUuid === mesh.uuid ? '#007bff' : '#343a40',
              color: 'white',
              borderRadius: '3px',
            }}
          >
            {mesh.name || `Unnamed Mesh`}
          </div>
        ))}
      </div>
    </div>
  );
}
