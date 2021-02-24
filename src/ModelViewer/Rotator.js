import { Component } from 'react';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import Slider from 'rc-slider';
import './Rotator.scss';
import 'rc-slider/assets/index.css';



const RESET = -1;

class Rotator extends Component {
   
   constructor(props) {
      super(props);
      this.state = {
         objPos: [0, 0, 0],
         objRot: [0, 0, 0, "XYZ"]
      }
   }

   componentDidMount() {
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
         this.props.scene.add(this.meshes[i]);
      }
      this.meshes[1].layers.set(0);
      this.controls = new TransformControls(this.props.camera, this.props.renderer.domElement);
      this.controls.attach(this.meshes[1]);
      this.controls.addEventListener("change", this.renderScene);
      this.props.scene.add(this.controls);
      this.props.renderer.domElement.addEventListener('mouseover', this.onCanvasMouseIn, false);
      this.props.renderer.domElement.addEventListener('mouseout', this.onCanvasMouseOut, false);
      document.body.addEventListener('keydown', this.handleKeyDown);
      this.renderScene();
   }
   renderScene = () => {
      this.setState({
         objPos: this.meshes[this.currentIdx].position.toArray(),
         objRot: this.meshes[this.currentIdx].rotation.toArray()
      });
      this.props.renderer.render(this.props.scene, this.props.camera);
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

   updateModel = (event) => {
      const newIdx = parseInt(event.target.value);
      this.meshes[newIdx].scale.copy(this.meshes[this.currentIdx].scale);
      this.meshes[newIdx].position.copy(this.meshes[this.currentIdx].position);
      this.meshes[newIdx].rotation.copy(this.meshes[this.currentIdx].rotation);

      this.meshes[this.currentIdx].layers.set(1);
      this.meshes[newIdx].layers.set(0);
      this.currentIdx = newIdx;
      this.controls.attach(this.meshes[newIdx]);
      this.renderScene();
   }
   
   updateScale = (axis, value) => {
      this.meshes[this.currentIdx].scale.setComponent(axis, value);
      this.renderScene();
   }

   updatePos = (axis, event) => {
      if(axis === RESET) {
         this.meshes[this.currentIdx].position.set(0, 0, 0);
      }
      else {
         this.meshes[this.currentIdx].position.setComponent(axis, event.target.value);
      }
      this.renderScene();
   }

   updateRot = (axis, event) =>{
      if(axis === RESET) {
         this.meshes[this.currentIdx].rotation.set(0, 0, 0, 'XYZ');
      }
      else {
         let newRot = this.meshes[this.currentIdx].rotation.toArray();
         newRot[axis] = THREE.Math.degToRad(event.target.value);
         this.meshes[this.currentIdx].rotation.set(...newRot);
      }

      this.renderScene();
   }

   trimDec = (num) => {
      return parseFloat(num).toFixed(3);
   }

   render() {
      return <div id="rotator-settings" className="settings-panel" style={{display: this.props.settingsMode == 0 ? 'flex' : 'none'}}>
         <p id="hint-mode" style={{display: this.props.settingsMode === 0 ? 'block' : 'none'}}>Press "r" to toggle modes</p> 
         <div id="scale-sliders">
            <p>X Scale</p>
            <Slider onChange={(e) => this.updateScale(0, e)} defaultValue={1} max={10}/>
            <p>Y Scale</p>
            <Slider onChange={(e) => this.updateScale(1, e)} defaultValue={1} max={10}/>
            <p>Z Scale</p>
            <Slider onChange={(e) => this.updateScale(2, e)} defaultValue={1} max={10}/>
         </div>
         <div id="settings-right">
            <div id="pos-input">
               <p>Position</p>
               <label>X</label>
               <input type="number" value={this.trimDec( this.state.objPos[0])} onChange={(e) => this.updatePos(0, e)} min={-3.6} max={3.6}/>
               <label>Y</label>
               <input type="number" value={this.trimDec(this.state.objPos[1])} onChange={(e) => this.updatePos(1, e)} min={-3.6} max={3.6}/>
               <label>Z</label>
               <input type="number" value={this.trimDec(this.state.objPos[2])} onChange={(e) => this.updatePos(2, e)}/>
               <button onClick={(e) => this.updatePos(RESET, e)}>Reset</button>
            </div>
            <div id="rot-input">
               <p>Rotation (Degrees)</p>
               <label>X</label>
               <input type="number" value={this.trimDec(THREE.Math.radToDeg(this.state.objRot[0]))} onChange={(e) => this.updateRot(0, e)}/>
               <label>Y</label>
               <input type="number" value={this.trimDec(THREE.Math.radToDeg(this.state.objRot[1]))} onChange={(e) => this.updateRot(1, e)}/>
               <label>Z</label>
               <input type="number" value={this.trimDec(THREE.Math.radToDeg(this.state.objRot[2]))} onChange={(e) => this.updateRot(2, e)}/>
               <button onClick={(e) => this.updateRot(RESET, e)}>Reset</button>
            </div>
            <div id="model-radio" onChange={this.updateModel}>
               <input type="radio" value="0" name="Model"/>Sphere
               <input type="radio" value="1" name="Model" defaultChecked/>Cube
               <input type="radio" value="2" name="Model"/>Cylinder
            </div>
         </div>
      </div>
   }
}

export default Rotator;