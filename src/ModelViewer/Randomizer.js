import { Component } from 'react';
import { ChromePicker } from 'react-color';
import Slider from 'rc-slider';
import * as THREE from 'three';
import { getRandomIntInclusive, getRandomNumber } from './RandomNumber';
import Timer from './Timer';
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
         maxObjects: 4,
         objColor: "#0000ff",
         seconds: 0
      }
      this.curMeshes = [];
      // TODO: random color
      this.material = new THREE.MeshBasicMaterial({
         color: this.state.objColor,
         polygonOffset: true,
         polygonOffsetFactor: 1, // positive value pushes polygon further away
         polygonOffsetUnits: 1
      });
      this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
      this.roundLineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
      this.capMaterial = new THREE.MeshBasicMaterial( { color: 0x6666ff } );

      this.updateSeconds = this.updateSeconds.bind(this);
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
      this.timer.startTimer();
      // TODO: Retrieve signal and re-randomize
      // TODO: Change randomize button into STOP
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
         // Add cylinder cap outlines
         if(objType === CYLINDER) {
            let topCap = new THREE.LineSegments( new THREE.EdgesGeometry( geom ), this.lineMaterial );
            let botCap = new THREE.LineSegments( new THREE.EdgesGeometry( geom ), this.lineMaterial );
            wireframe.add(topCap);
            wireframe.add(botCap);
            topCap.position.setComponent(1, geom.parameters.height/2);
            botCap.position.setComponent(1, -geom.parameters.height/2);
            topCap.scale.setComponent(1, 0);
            botCap.scale.setComponent(1, 0);
            topCap.layers.set(2);
            botCap.layers.set(2);
         }
      }
      wireframe.layers.set(2);
      mesh.add( wireframe );

      return mesh;
   }

   updateMinObjects = (value) => {
      this.setState({
         minObjects: value,
      }, () => {
         if(value > this.state.maxObjects) {
            this.updateMaxObjects(value);
         }
      });
   }

   updateMaxObjects = (value) => {
      this.setState({
         maxObjects: value,
      }, () => {
         if(value < this.state.minObjects) {
            this.updateMinObjects(value);
         }
      });
   }

   updateObjColor = (event) => {
      this.setState({
         objColor: event.hex
      });
      this.material.color.set(event.hex);
      this.props.renderer.render(this.props.scene, this.props.camera);
   }

   updateSeconds= (event) => {
      this.setState({
         seconds: parseInt(event.target.value) // countDown subtracts 1 for re-rendering
      });
   }
   
   render() {
      return (
         <div id="randomizer-settings" className="settings-panel" style={{display: this.props.settingsMode == 2 ? 'block' : 'none'}}>
            <p id="timer" style={{display: this.props.settingsMode === 2 ? 'block' : 'none'}}>
               <Timer ref={timer => {this.timer=timer}} seconds={this.state.seconds} updateSeconds={this.updateSeconds}></Timer>
            </p> 
            <div id="scale-sliders">
               <p>Min. Objects</p>
               <Slider onChange={this.updateMinObjects} value={this.state.minObjects} min={1} max={10}/>
               <p>Max Objects</p>
               <Slider onChange={this.updateMaxObjects} value={this.state.maxObjects} min={1} max={10}/>
            </div>
            <ChromePicker onChange={this.updateObjColor} color={this.state.objColor}/>
            <div>
               <label>Timer (0 for Off)</label>
               <input type="number" defaultValue={0} onChange={this.updateSeconds} id="timer-input"></input>
               <button onClick={this.randomize}>Randomize!</button>
            </div>
         </div>
      )
   }
}

export default Randomizer;