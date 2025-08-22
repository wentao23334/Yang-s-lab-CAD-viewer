import { useViewerStore } from '../state/viewerStore';

export default function Toolbar() {
  const {
    displayMode,
    setDisplayMode,
    availableModels,
    currentModel,
    setCurrentModel,
    isGridVisible,
    toggleGrid,
    backgroundColor,
    setBackgroundColor,
  } = useViewerStore();

  const styles = {
    button: (isActive: boolean = false) => ({
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      cursor: 'pointer',
      backgroundColor: isActive ? '#007bff' : '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
    }),
    buttonGroup: {
      display: 'flex',
      gap: '5px',
    },
    select: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      backgroundColor: '#343a40',
      color: 'white',
      border: '1px solid #6c757d',
      borderRadius: '3px',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    checkboxLabel: {
        marginLeft: '8px',
    }
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentModel(event.target.value);
  };

  return (
    <div>
      <h4>Tools</h4>

      <h5>Select Model</h5>
      <select onChange={handleModelChange} value={currentModel} style={styles.select}>
        {availableModels.map((modelName) => (
          <option key={modelName} value={modelName}>
            {modelName}
          </option>
        ))}
      </select>

      <h5>Display Mode</h5>
      <div style={styles.buttonGroup}>
        <button onClick={() => setDisplayMode('normal')} style={styles.button(displayMode === 'normal')}>
          Normal
        </button>
        <button onClick={() => setDisplayMode('isolated')} style={styles.button(displayMode === 'isolated')}>
          Isolate
        </button>
        <button onClick={() => setDisplayMode('xray')} style={styles.button(displayMode === 'xray')}>
          X-Ray
        </button>
      </div>

      <h5>Scene Settings</h5>
      <div style={styles.checkboxContainer}>
        <input type="checkbox" id="grid-toggle" checked={isGridVisible} onChange={toggleGrid} />
        <label htmlFor="grid-toggle" style={styles.checkboxLabel}>Show Grid</label>
      </div>
      <div style={styles.buttonGroup}>
        <button onClick={() => setBackgroundColor('#ffffff')} style={styles.button(backgroundColor === '#ffffff')}>
          White BG
        </button>
        <button onClick={() => setBackgroundColor('#000000')} style={styles.button(backgroundColor === '#000000')}>
          Black BG
        </button>
      </div>
    </div>
  );
}
