import { Component } from "react";
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

class Rotator extends Component {
   componentDidMount() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, 1/*window.innerWidth/window.innerHeight*/, 0.1, 1000 );
      this.camera.position.z = 4;
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize( 650, 650 );
      this.mount.appendChild(this.renderer.domElement);
      this.controls = new TrackballControls( this.camera, this.renderer.domElement );
      this.controls.target.set( 0, 0, 0 )
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const line = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({color: 0x00000}))
      this.scene.add(line)
      this.cube = new THREE.Mesh( geometry, material );
      this.scene.add( this.cube );
      
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

   render() {
      return (
         <div id="model-rotator"
            ref={ (mount) => { this.mount = mount }}
         />
      )
   }
}

export default Rotator;