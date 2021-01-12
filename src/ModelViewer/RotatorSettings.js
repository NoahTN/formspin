import { Component } from 'react';
import { MathUtils } from 'three/src/math/MathUtils.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class RotatorSettings extends Component {
   constructor(props) {
      super(props);
      
      this.scaleXHandler = this.scaleXHandler.bind(this);
      this.scaleYHandler = this.scaleYHandler.bind(this);
      this.scaleZHandler = this.scaleZHandler.bind(this);
      this.modelChangeHandler = this.modelChangeHandler.bind(this);
   }

   scaleXHandler(value) {
      this.props.changeScale(0, value);
   }
   scaleYHandler(value) {
      this.props.changeScale(1, value);
   }
   scaleZHandler(value) {
      this.props.changeScale(2, value);
   }
   
   posHandler(axis, event) {
      this.props.changePos(axis, event.target.value);
   }

   rotHandler(axis, event) {
      this.props.changeRot(axis, event.target.value);
   }

   modelChangeHandler(event) {
      this.props.changeModel(event.target.value);
   }

   render() {
      return <div id="rotator-settings" className="settings-panel">
         <div id="scale-sliders">
            <div>
               <Slider onChange={this.scaleXHandler} defaultValue={1} max={10}/>
               <Slider onChange={this.scaleYHandler} defaultValue={1} max={10}/>
               <Slider onChange={this.scaleZHandler} defaultValue={1} max={10}/>
            </div>
            <div id="pos-input">
               <input type="number" value={this.props.objPos[0]} onChange={(e) => this.posHandler(0, e)} min={-3.6} max={3.6}/>
               <input type="number" value={this.props.objPos[1]} onChange={(e) => this.posHandler(1, e)} min={-3.6} max={3.6}/>
               <input type="number" value={this.props.objPos[2]} onChange={(e) => this.posHandler(2, e)}/>
               <button onClick={(e) => this.posHandler(-1, e)}>Reset</button>
            </div>
            <div id="rot-input">
               <input type="number" value={MathUtils.radToDeg(this.props.objRot[0])} onChange={(e) => this.rotHandler(0, e)}/>
               <input type="number" value={MathUtils.radToDeg(this.props.objRot[1])} onChange={(e) => this.rotHandler(1, e)}/>
               <input type="number" value={MathUtils.radToDeg(this.props.objRot[2])} onChange={(e) => this.rotHandler(2, e)}/>
               <button onClick={(e) => this.rotHandler(-1, e)}>Reset</button>
            </div>
       
         </div>
         <div onChange={this.modelChangeHandler}>
            <input type="radio" value="0" name="Model"/>Sphere
            <input type="radio" value="1" name="Model" defaultChecked/>Cube
            <input type="radio" value="2" name="Model"/>Cylinder
         </div>
      </div>
   }
}

export default RotatorSettings;