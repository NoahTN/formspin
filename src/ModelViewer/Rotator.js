import { Component } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import RotatorSettings from './RotatorSettings';

class Rotator extends Component {
   constructor(props) {
      super(props);
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
      this.controls = new TransformControls( this.camera, this.renderer.domElement );
      this.controls.addEventListener('change', this.renderScene);

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
         this.meshes[i].visible = i===1 ? true : false;
         this.scene.add(this.meshes[i]);
      }
      this.controls.attach(this.meshes[1]);
      this.scene.add(this.controls);
      this.renderScene();
   }

   renderScene = () => {
      // relay state values here to input in child component
      this.renderer.render(this.scene, this.camera);
   }

   changeModel(event) {
      const newIdx = parseInt(event.target.value);
      this.meshes[newIdx].scale.set(...this.meshes[this.currentIdx].scale.toArray());
      this.meshes[newIdx].position.set(...this.meshes[this.currentIdx].position.toArray());
      this.meshes[newIdx].rotation.set(...this.meshes[this.currentIdx].rotation.toArray());

      this.meshes[this.currentIdx].visible = false;
      this.currentIdx = newIdx;
      this.controls.attach(this.meshes[newIdx]);
      this.renderScene();
   }

   changeScale(axis, value) {
      this.meshes[this.currentIdx].scale.setComponent(axis, value);
      this.renderScene();
   }

   changePos(axis, value) {
      this.meshes[this.currentIdx].position.setComponent(axis, value);
      // this.camera.position.set(0, 0, 4);
      // this.camera.rotation.set(0, 0, 0, "XYZ");
      // this.controls.update();
      this.renderScene();
   }

   changeRot(axis, value) {
      let newRot = this.meshes[this.currentIdx].rotation.toArray();
      newRot[axis] = THREE.Math.degToRad(value);
      this.meshes[this.currentIdx].rotation.set(...newRot);
      this.renderScene();
   }

   render() {
      return (
         <div id="rotator">
            <div id="rotator-canvas" ref={ (mount) => { this.mount = mount }}>
            </div>
            <RotatorSettings 
               // different class for randomizer but same css class
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