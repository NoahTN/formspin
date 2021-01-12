import { Component } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import RotatorSettings from './RotatorSettings';
import './Rotator.scss';

const RESET = -1;

class Rotator extends Component {
   
   constructor(props) {
      super(props);
      this.state = {
         objPos: [0, 0, 0],
         objRot: [0, 0, 0, "XYZ"]
      }

      this.changeModel = this.changeModel.bind(this);
      this.changeScale = this.changeScale.bind(this);
      this.changePos = this.changePos.bind(this);
      this.changeRot = this.changeRot.bind(this);
   }

   componentDidMount() {
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize( 650, 650 );
      this.mount.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera( 75, 1/*window.innerWidth/window.innerHeight*/, 0.1, 1000 );
      this.camera.position.setComponent(2, 4);

      // Create initial geometries
      this.currentIdx = 1;
      this.material = new THREE.MeshNormalMaterial();
      this.geoms = [
         new THREE.SphereGeometry( 1, 50, 50 ), 
         new THREE.BoxGeometry( 1, 1, 1 ),  
         new THREE.CylinderGeometry( 1, 1, 1, 50 )
      ];
      // Create meshes and corresponding outlines
      this.meshes = [];
      this.lines = [];
      for(let i = 0; i < 3; i++) {
         this.meshes.push(new THREE.Mesh( this.geoms[i], this.material ));
         this.meshes[i].layers.set(1);
         this.scene.add(this.meshes[i]);
      }
      this.meshes[1].layers.set(0);
      this.controls = new TransformControls(this.camera, this.renderer.domElement);
      this.controls.attach(this.meshes[1]);
      this.controls.addEventListener("change", this.renderScene);
      this.scene.add(this.controls);
      this.renderer.domElement.addEventListener('mouseover', this.onCanvasMouseIn, false);
      this.renderer.domElement.addEventListener('mouseout', this.onCanvasMouseOut, false);
      document.body.addEventListener('keydown', this.handleKeyDown);
      this.renderScene();
   }

   renderScene = () => {
      this.setState({
         objPos: this.meshes[this.currentIdx].position.toArray(),
         objRot: this.meshes[this.currentIdx].rotation.toArray()
      });
      this.renderer.render(this.scene, this.camera);
   }

   onCanvasMouseIn = (event) => {
      this.controls.showX = this.controls.showY = this.controls.showZ = true;
   }

   onCanvasMouseOut = (event) => {
      this.controls.showX = this.controls.showY = this.controls.showZ = false;
   }

   handleKeyDown = (event) => {
      if(event.key === "r" || event.key === "R") {
         this.toggleRotate();
      }
   }

   toggleRotate = (event) => {
      if(this.controls.getMode() === "rotate") {
         this.controls.setMode("translate");
      }
      else {
         this.controls.setMode("rotate");
      }
   }

   changeModel(idx) {
      const newIdx = parseInt(idx);
      this.meshes[newIdx].scale.copy(this.meshes[this.currentIdx].scale);
      this.meshes[newIdx].position.copy(this.meshes[this.currentIdx].position);
      this.meshes[newIdx].rotation.copy(this.meshes[this.currentIdx].rotation);

      this.meshes[this.currentIdx].layers.set(1);
      this.meshes[newIdx].layers.set(0);
      this.currentIdx = newIdx;
      this.controls.attach(this.meshes[newIdx]);
      this.renderScene();
   }

   changeScale(axis, value) {
      this.meshes[this.currentIdx].scale.setComponent(axis, value);
      this.renderScene();
   }

   changePos(axis, value) {
      if(axis === RESET) {
         this.meshes[this.currentIdx].position.set(0, 0, 0);
      }
      else {
         this.meshes[this.currentIdx].position.setComponent(axis, value);
      }
      this.renderScene();
   }

   changeRot(axis, value) {
      if(axis === RESET) {
         this.meshes[this.currentIdx].rotation.set(0, 0, 0, 'XYZ');
      }
      else {
         
         let newRot = this.meshes[this.currentIdx].rotation.toArray();
         newRot[axis] = THREE.Math.degToRad(value);
         this.meshes[this.currentIdx].rotation.set(...newRot);
      }

      this.renderScene();
   }

   render() {
      return (
         <div id="rotator">
            <div id="rotator-canvas" ref={ (mount) => { this.mount = mount }}>
               <p id="hint-mode">Press "r" to toggle modes</p>
            </div>
            <RotatorSettings 
               // different class for randomizer but same css class
               objPos={this.state.objPos}
               objRot={this.state.objRot}
               changeModel={this.changeModel}
               changeScale={this.changeScale}
               changePos={this.changePos}
               changeRot={this.changeRot}
            />
         </div>
      )
   }
}

export default Rotator;