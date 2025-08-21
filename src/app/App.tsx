import CanvasScene from '../components/CanvasScene';
import PartList from '../components/PartList';
import MaterialPanel from '../components/MaterialPanel';
import Toolbar from '../components/Toolbar';
import '../styles/App.css';

function App() {
  return (
    <div className="app-container">
      <div className="viewer-container">
        <CanvasScene />
      </div>
      <div className="ui-container">
        <Toolbar />
        <hr />
        <PartList />
        <hr />
        <MaterialPanel />
      </div>
    </div>
  );
}

export default App;
