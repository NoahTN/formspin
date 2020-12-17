import { Component } from "react";
import * as THREE from 'three';

class ModelViewer extends Component {
   componentDidMount() {
      // === THREE.JS CODE START ===
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, 1/*window.innerWidth/window.innerHeight*/, 0.1, 1000 );
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( 650, 650 );
      document.getElementById("model-viewer").appendChild(renderer.domElement);
      //document.body.appendChild( renderer.domElement );
      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );
      camera.position.z = 5;
      renderer.render( scene, camera );
      // === THREE.JS EXAMPLE CODE END ===
    }
    render() {
      return (
        <div id="model-viewer"/>
      )
    }
}

export default ModelViewer;