import { Component } from 'react';
import Slider from 'rc-slider';
import * as THREE from 'three';
import './Randomizer.scss';

const SPHERE = 0;
const CUBE = 1;
const CYLINDER = 2;

class Randomizer extends Component {
   constructor(props) {
      super(props)
      this.lowerLimit = 1;
      this.upperLimit = 4;
      this.curMeshes = [];
      // TODO: random color
      this.material = new THREE.MeshBasicMaterial({
         color: 0x0000ff,
         polygonOffset: true,
         polygonOffsetFactor: 1, // positive value pushes polygon further away
         polygonOffsetUnits: 1
      });
      this.frameMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
      this.curvedframeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.BackSide } );
   }

   componentDidMount() {
      this.randomize();
      // settings maybe on canvas

   }

   randomize = () => {
      for(let i = 0; i < this.curMeshes.length; i++) {
         this.props.scene.remove(this.curMeshes[i]);
      }
      this.curMeshes = [];
      // create random objects based on settings
      let randCount = this.getRandomIntInclusive(this.lowerLimit, this.upperLimit);
      // create new object and store for removal
      for(let i = 0; i < randCount; i++) {
         this.curMeshes.push(this.createRandomObject())
         this.props.scene.add(this.curMeshes[i]);
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
      
      let wireframe;
      if(objType === CUBE) {
         let lineGeom = new THREE.EdgesGeometry( geom );
         wireframe =  new THREE.LineSegments( lineGeom, this.frameMaterial );
      }
      else { // BUG: Displays as white no matter the material settings
         wireframe = new THREE.Mesh( geom, this.curvedFrameMaterial );
         wireframe.scale.multiplyScalar(1.05);
      }
      wireframe.layers.set(2);
      mesh.add( wireframe );

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
         <div id="randomizer-settings" className="settings-panel" style={{display: this.props.settingsMode == 2 ? 'block' : 'none'}}>
            <p id="timer" style={{display: this.props.settingsMode === 2 ? 'block' : 'none'}}>60</p> 
            <div id="scale-sliders">
               <Slider onChange={(e) => this.changeScale(0, e)} defaultValue={1} max={10}/>
            </div>
            <div>
               <input type="radio" name="test"/>setting1
               <input type="radio" name= "test"/>setting2
               <button onClick={this.randomize}>Randomize!</button>
            </div>
         </div>
      )
   }
}

export default Randomizer;