import { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class ViewerSettings extends Component {
   constructor(props) {
      super(props);
      this.xSize = this.ySize = this.zSize = 1;
      this.xRot = this.yRot = this.zRot = 0;
   }

   onModelChange(event) {
      this.props.onModelChange(event);
   }

   onXSizeChange(value) {
      this.xSize = value;
      this.props.onSizeChange([this.xSize, this.ySize, this.zSize]);
   }
   onYSizeChange(value) {
      this.ySize = value;
      this.props.onSizeChange([this.xSize, this.ySize, this.zSize]);
   }
   onZSizeChange(value) {
      this.zSize = value;
      this.props.onSizeChange([this.xSize, this.ySize, this.zSize]);
   }
   
   // onPosChange(event) {

   // }

   onXRotChange(event) {
      let value=event.target.value;
      this.xRot = value;
      this.props.onRotChange([this.xRot, this.yRot, this.zRot]);
   }
   onYRotChange(event) {
      let value=event.target.value;
      this.yRot = value;
      this.props.onRotChange([this.xRot, this.yRot, this.zRot]);
   }
   onZRotChange(event) {
      let value=event.target.value;
      this.zRot = value;
      this.props.onRotChange([this.xRot, this.yRot, this.zRot]);
   }

   render() {
      return <div id="viewer-settings">
         <div id="size-sliders">
            <div>
               <Slider onChange={this.onXSizeChange.bind(this)} defaultValue={1} max={10}/>
               <Slider onChange={this.onYSizeChange.bind(this)} defaultValue={1} max={10}/>
               <Slider onChange={this.onZSizeChange.bind(this)} defaultValue={1} max={10}/>
            </div>
            {/* <div id="pos-inputs">
               <input type="text"/>
               <input type="text"/>
               <input type="text"/>
            </div> */}
            <div id="rot-input">
               <input type="number" onChange={this.onXRotChange.bind(this)} defaultValue={0}/>
               <input type="number" onChange={this.onYRotChange.bind(this)} defaultValue={0}/>
               <input type="number" onChange={this.onZRotChange.bind(this)} defaultValue={0}/>
            </div>
         </div>
         
         <div onChange={this.onModelChange.bind(this)}>
            <input type="radio" value="0" name="Model"/>Sphere
            <input type="radio" value="1" name="Model" defaultChecked/>Cube
            <input type="radio" value="2" name="Model"/>Cylinder
         </div>
      </div>
      
       
   }
}

export default ViewerSettings;