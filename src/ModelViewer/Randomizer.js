import { Component } from 'react';
import * as THREE from 'three';

const SPHERE = 0;
const CUBE = 1;
const CYLINDER = 2;

class Randomizer extends Component {
   constructor(props) {
      super(props)
      this.lowerLimit = 1;
      this.upperLimit = 1;
   }

   componentDidMount() {
      this.material = new THREE.MeshNormalMaterial();
      this.randomize();
      // settings maybe on canvas

   }

   randomize = () => {
      // create random objects based on settings
      let randCount = this.getRandomIntInclusive(this.lowerLimit, this.upperLimit+3);
      for(let i = 0; i < randCount; i++) {
         this.props.scene.add(this.createRandomObject());
      }
      this.props.renderer.render(this.props.scene, this.props.camera);
      //  display and set timer


   }

   createRandomObject = () => {
      const objType = this.getRandomIntInclusive(0, 2);
      let geom;
      switch(objType) {
         case SPHERE:
            geom = new THREE.SphereGeometry(
               this.getRandomIntInclusive(1, 4), 
               50, 
               50
            );
            break;
         case CUBE:
            geom = new THREE.BoxGeometry( 
               this.getRandomIntInclusive(1, 4),
               this.getRandomIntInclusive(1, 4),
               this.getRandomIntInclusive(1, 4)
            );
            break;
         case CYLINDER:
            const radius = this.getRandomIntInclusive(1, 4);
            geom = new THREE.CylinderGeometry( 
               radius, 
               radius, 
               this.getRandomIntInclusive(1, 4), 
               50
            );
            break;
      }

      const mesh = new THREE.Mesh( geom, this.material );
      mesh.layers.set(2);
      mesh.position.set(
         this.getRandomNumber(-3.1, 3.1),
         this.getRandomNumber(-3.1, 3.1),
         this.getRandomNumber(-15, 1),
      );
      mesh.rotation.set(
         this.getRandomNumber(-Math.PI, Math.PI),
         this.getRandomNumber(-Math.PI, Math.PI),
         this.getRandomNumber(-Math.PI, Math.PI),
      );
      return mesh;
   }

   getRandomIntInclusive(min, max) {
      return Math.floor(Math.random() * (max-min+1) + min);
   }

   getRandomNumber(min, max) {
      return Math.random() * (max - min) + min;
   }

   render() {
      return (
         <div id="randomizer-settings" className="settings-panel">
            <div>
               <input type="radio" name="test"/>setting1
               <input type="radio" name= "test"/>setting2
            </div>
         </div>
      )
   }
}

export default Randomizer;