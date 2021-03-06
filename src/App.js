import logo from './logo.svg';
import './App.scss';
import ModelViewer from './ModelViewer/ModelViewer';
import SketchPad from './SketchPad/SketchPad';

function App() {
  return (
    <div className="App">
      {/* <header className="header">
        <img src={logo} className="logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <div className="main">
        <ModelViewer/>
        <SketchPad/>
      </div>
    </div>
  );
}

export default App;
