import { Component } from 'react';
import Slider from 'rc-slider';
import * as THREE from 'three';
import { getRandomIntInclusive, getRandomNumber } from './RandomNumber';
import './Randomizer.scss';

const SPHERE = 0;
const CUBE = 1;
const CYLINDER = 2;
const MIN_LIMIT = 0
const MAX_LIMIT = 1

class Randomizer extends Component {
   constructor(props) {
      super(props)
      this.state = {
         minObjects: 1,
         maxObjects: 4
      }
      this.curMeshes = [];
      // TODO: random color
      this.material = new THREE.MeshBasicMaterial({
         color: 0x0000ff,
         polygonOffset: true,
         polygonOffsetFactor: 1, // positive value pushes polygon further away
         polygonOffsetUnits: 1
      });
      this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
      this.roundLineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
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
      let randCount = getRandomIntInclusive(this.state.minObjects, this.state.maxObjects);
      // create new object and store for removal
      for(let i = 0; i < randCount; i++) {
         this.curMeshes.push(this.createRandomObject());
         this.props.scene.add(this.curMeshes[i]);
      }
      this.props.renderer.render(this.props.scene, this.props.camera);
      //  display and set timer


   }

   createRandomObject = () => {
      const objType = getRandomIntInclusive(0, 2);
      let geom;

      switch(objType) {
         case SPHERE:
            geom = new THREE.SphereGeometry(
               getRandomIntInclusive(1, 3), 
               50, 
               50
            );
            break;
         case CUBE:
            geom = new THREE.BoxGeometry( 
               getRandomIntInclusive(1, 4),
               getRandomIntInclusive(1, 4),
               getRandomIntInclusive(1, 4)
            );
            break;
         case CYLINDER:
            const radius = getRandomIntInclusive(1, 4);
            geom = new THREE.CylinderGeometry( 
               radius, 
               radius, 
               getRandomIntInclusive(1, 4), 
               50
            );
            break;
      }
      
      const mesh = new THREE.Mesh( geom, this.material );
      mesh.layers.set(2);
      // TODO: Large objects close to the camera can't be seen entirely, consider moving back based on size
      mesh.position.set(
         getRandomNumber(-3.1, 3.1),
         getRandomNumber(-3.1, 3.1),
         getRandomNumber(-15, 1),
      );
      mesh.rotation.set(
         getRandomNumber(-Math.PI, Math.PI),
         getRandomNumber(-Math.PI, Math.PI),
         getRandomNumber(-Math.PI, Math.PI),
      );
      
      let wireframe;
      if(objType === CUBE) {
         let lineGeom = new THREE.EdgesGeometry( geom );
         wireframe =  new THREE.LineSegments( lineGeom, this.lineMaterial );
      }
      else {
         wireframe = new THREE.Mesh( geom, this.roundLineMaterial );
         wireframe.scale.multiplyScalar(1.01);
      }
      wireframe.layers.set(2);
      mesh.add( wireframe );

      return mesh;
   }

   changeMinObjects = (value) => {
      this.setState({
         minObjects: value,
      }, () => {
         if(value > this.state.maxObjects) {
            this.changeMaxObjects(value);
         }
      });
   }

   changeMaxObjects = (value) => {
      this.setState({
         maxObjects: value,
      }, () => {
         if(value < this.state.minObjects) {
            this.changeMinObjects(value);
         }
      });
   }
   
   render() {
      return (
         <div id="randomizer-settings" className="settings-panel" style={{display: this.props.settingsMode == 2 ? 'block' : 'none'}}>
            <p id="timer" style={{display: this.props.settingsMode === 2 ? 'block' : 'none'}}>60</p> 
            <div id="scale-sliders">
               <p>Min. Objects</p>
               <Slider onChange={this.changeMinObjects} value={this.state.minObjects} min={1} max={10}/>
               <p>Max Objects</p>
               <Slider onChange={this.changeMaxObjects} value={this.state.maxObjects} min={1} max={10}/>
            </div>
            <div>
               <button onClick={this.randomize}>Randomize!</button>
            </div>
         </div>
      )
   }
}

export default Randomizer;