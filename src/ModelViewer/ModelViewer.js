import { Component } from 'react';
import * as THREE from 'three';
import Randomizer from './Randomizer';
import Rotator from './Rotator';

const settings = {

}

const MODE_ROTATE = 0;
const MODE_RAND = 2;

class ModelViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsMode: 2
    };
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer( { antialias: true });
    this.renderer.setSize( 650, 650 );
    this.renderer.setPixelRatio(1.5);
    this.camera = new THREE.PerspectiveCamera( 75, 1/*window.innerWidth/window.innerHeight*/, 0.1, 1000 );
    this.camera.position.setComponent(2, 4);

    // Randomizer debugging purposes
    this.camera.layers.set(2);
    
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
 }

  componentDidMount() {
      this.mount.appendChild(this.renderer.domElement);
  }

  changeViewerMode = (event) => {
    this.camera.layers.set(parseInt(event.target.value));
    this.setState({
      settingsMode: parseInt(event.target.value)
    });
    this.renderScene();

  }

  render() {
    return (
      <div>
        <div id="viewer-canvas" ref={ (mount) => { this.mount = mount }}>
        </div>
        <Rotator 
          settings={settings}
          scene={this.scene}
          renderer={this.renderer}
          camera={this.camera}
          settingsMode={this.state.settingsMode}
        />
        <Randomizer 
          settings={settings}
          scene={this.scene}
          renderer={this.renderer}
          camera={this.camera}
          settingsMode={this.state.settingsMode}
        />
        <div onChange={this.changeViewerMode}>
          <input type="radio" value={MODE_ROTATE} name="viewer-mode"/>Rotator
          <input type="radio" value={MODE_RAND} name="viewer-mode" defaultChecked/>Randomizer
        </div>
      </div>
    )
  }
}

export default ModelViewer;