import { Component } from 'react';
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class SketchPad extends Component{
   constructor(props) {
      super(props);
      this.state = {brushSize: 5};
   }

   onBrushSizeChange(value) {
      this.setState({
         brushSize: value
      });
   } 

   render() {
      return <div id="sketch-pad">
         <CanvasDraw 
            ref={drawCanvas => (this.drawCanvas = drawCanvas)}
            canvasWidth={650} 
            canvasHeight={650}
            catenaryColor={"#0000"}
            lazyRadius={0}
            hideGrid={true}
            brushRadius={this.state.brushSize}
            
         />
         {/* Brush Size */}
         <Slider onChange={this.onBrushSizeChange.bind(this)} defaultValue={1} max={15}/>
         {/* Color Picker */}
         <Slider defaultValue={1} max={15}/>
         {/* Eraser
            Clear Canvas
            Undo
            */}
         <button onClick={() => {this.drawCanvas.undo()}}>
            Undo
         </button>
         <button onClick={() => {this.drawCanvas.clear()}}>
            Clear
         </button>
      </div>
   }
}

export default SketchPad;