import { Component } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Rotator extends Component {
   constructor() {
      super();
      this.state = {
         name: "model"
      };
      this.onChangeValue = this.onChangeValue.bind(this);
   }

   componentDidMount() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, 1/*window.innerWidth/window.innerHeight*/, 0.1, 1000 );
      this.camera.position.z = 4;
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize( 650, 650 );
      this.mount.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.controls.target.set( 0, 0, 0 )
      
      this.currentIdx = 1;
      this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      this.geoms = [
         new THREE.SphereGeometry( 1 ), 
         new THREE.BoxGeometry( 1, 1, 1 ),  
         new THREE.CylinderGeometry( 1, 1, 1 )
      ];
      this.meshes = []
      this.lines = []
      for(let i = 0; i < 3; i++) {
         this.meshes[i] = new THREE.Mesh( this.geoms[i], this.material );
         this.lines.push(new THREE.LineSegments(new THREE.EdgesGeometry(this.geoms[i]), new THREE.LineBasicMaterial({color: 0x00000})))
         this.meshes[i].visible = i==1 ? true : false;
         this.lines[i].visible = i==1 ? true : false;
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
      this.renderScene()
   }

   renderScene = () => {
      this.renderer.render(this.scene, this.camera)
   }

   onChangeValue(event) {
      const newIdx = parseInt(event.target.value);
      this.meshes[this.currentIdx].visible = false;
      this.lines[this.currentIdx].visible = false;
      this.meshes[newIdx].visible = true;
      this.lines[newIdx].visible = true;
      this.currentIdx = newIdx;
      
   }

   render() {
      return (
         <div id="rotator">
            <div id="rotator-canvas" ref={ (mount) => { this.mount = mount }}>
            </div>
            <div id="rotator-settings" onChange={this.onChangeValue}>
               <input type="radio" value="0" name="Model"/>Sphere
               <input type="radio" value="1" name="Model" defaultChecked/>Cube
               <input type="radio" value="2" name="Model"/>Cylinder
            </div>
         </div>
      )
   }
}

export default Rotator;