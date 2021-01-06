import { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ViewerSettings from './ViewerSettings';

class Rotator extends Component {
   constructor(props) {
      super(props);
      this.state = {
         objRot: [0, 0, 0],
         cameraPos: [0, 0, 4],
      }
      this.onModelChange = this.onModelChange.bind(this);
      this.onScaleChange = this.onScaleChange.bind(this);
      this.onPosChange = this.onPosChange.bind(this);
      this.onRotChange = this.onRotChange.bind(this);
   }


   componentDidMount() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, 1/*window.innerWidth/window.innerHeight*/, 0.1, 1000 );
      this.camera.position.setComponent(2, 4);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize( 650, 650 );
      this.mount.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.controls.addEventListener('change', this.renderScene);
      this.controls.target.set( 0, 0, 0 )
      // Create initial geometries
      this.currentIdx = 1;
      this.material = new THREE.MeshNormalMaterial();
      this.geoms = [
         new THREE.SphereGeometry( 1, 50, 50 ), 
         new THREE.BoxGeometry( 1, 1, 1 ),  
         new THREE.CylinderGeometry( 1, 1, 1, 50 )
      ];
      // Create meshes and corresponding outlines
      this.meshes = []
      this.lines = []
      for(let i = 0; i < 3; i++) {
         this.meshes[i] = new THREE.Mesh( this.geoms[i], this.material );
         this.lines.push(new THREE.Mesh(this.geoms[i], new THREE.MeshBasicMaterial( {color: 0x000ff, side: THREE.BackSide} )));
         this.lines[i].scale.multiplyScalar(0);
         this.lines[i].visible = i===1 ? true : false;
         this.meshes[i].visible = i===1 ? true : false;
         this.scene.add(this.meshes[i]);
         this.scene.add(this.lines[i]);
      }
      this.renderScene();
   }

   renderScene = () => {
      this.setState({
         objRot: this.state.objRot,
         cameraPos: this.state.cameraPos
      });
      this.renderer.render(this.scene, this.camera);
   }

   onModelChange(event) {
      const newIdx = parseInt(event.target.value);
      this.meshes[newIdx].scale.set(...this.meshes[this.currentIdx].scale.toArray());
      this.meshes[newIdx].position.set(...this.meshes[this.currentIdx].position.toArray());
      this.meshes[newIdx].rotation.set(...this.meshes[this.currentIdx].rotation.toArray());
      this.lines[newIdx].scale.set(...this.lines[this.currentIdx].scale.toArray());
      this.lines[newIdx].position.set(...this.meshes[this.currentIdx].position.toArray());
      this.meshes[newIdx].rotation.set(...this.meshes[this.currentIdx].rotation.toArray());

      this.meshes[this.currentIdx].visible = false;
      this.lines[this.currentIdx].visible = false;
      this.meshes[newIdx].visible = true;
      this.lines[newIdx].visible = true;
      this.currentIdx = newIdx;
      this.renderScene();
   }

   onScaleChange(axis, value) {
      this.meshes[this.currentIdx].scale.setComponent(axis, value);
      this.renderScene();
   }

   onPosChange(axis, value) {
      this.camera.position.setComponent(axis, value);
      this.camera.position.toArray(this.state.cameraPos);
      this.controls.update();
   }

   onRotChange(axis, value) {
      this.state.objRot[axis] = THREE.Math.degToRad(value);
      this.meshes[this.currentIdx].rotation.set(...this.state.objRot);
      this.renderScene();
   }

   render() {
      return (
         <div id="rotator">
            <div id="rotator-canvas" ref={ (mount) => { this.mount = mount }}>
            </div>
            <ViewerSettings 
               mode="1" 
               onModelChange={this.onModelChange}
               objRot={this.state.objRot} 
               cameraPos={this.state.cameraPos}
               onScaleChange={this.onScaleChange}
               onPosChange={this.onPosChange}
               onRotChange={this.onRotChange}
            />

            
         </div>
      )
   }
}

export default Rotator;