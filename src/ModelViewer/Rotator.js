import { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ViewerSettings from './ViewerSettings';

class Rotator extends Component {

   componentDidMount() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, 1/*window.innerWidth/window.innerHeight*/, 0.1, 1000 );
      this.camera.position.z = 4;
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize( 650, 650 );
      this.mount.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
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
      
      this.start();
   }

   componentWillUnmount(){
      this.stop()
      this.mount.removeChild(this.renderer.domElement)
   }
   
   start = () => {
      if (!this.frameId) {
         this.frameId = requestAnimationFrame(this.animate)
      }
   }

   stop = () => {
      cancelAnimationFrame(this.frameId)
   }

   animate = () => {
      this.controls.update();  
      this.frameId = window.requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
   }

   onModelChange(event) {
      const newIdx = parseInt(event.target.value);
      this.meshes[this.currentIdx].visible = false;
      this.lines[this.currentIdx].visible = false;
      this.meshes[newIdx].visible = true;
      this.lines[newIdx].visible = true;
      this.currentIdx = newIdx;
   }

   onSizeChange(sizes) {
      for(let i = 0; i < 3; i++) {
         this.meshes[i].scale.set(...sizes);
         this.lines[i].scale.set(...sizes);
      }
   }

   onRotChange(rots) {
      console.log(rots);
      rots = rots.map(r => THREE.Math.degToRad(r));
      console.log(rots);
      for(let i = 0; i < 3; i++) {
         this.meshes[i].rotation.set(...rots);
         this.lines[i].rotation.set(...rots);
      }
   }

   render() {
      return (
         <div id="rotator">
            <div id="rotator-canvas" ref={ (mount) => { this.mount = mount }}>
            </div>
            <ViewerSettings 
               mode="1" 
               onModelChange={this.onModelChange.bind(this)} 
               onSizeChange={this.onSizeChange.bind(this)}
               onRotChange={this.onRotChange.bind(this)}
            />

            
         </div>
      )
   }
}

export default Rotator;