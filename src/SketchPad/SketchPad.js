import { Component } from 'react';
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import { SketchPicker } from 'react-color';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class SketchPad extends Component{
   constructor(props) {
      super(props);
      this.state = {
         brushSize: 5,
         brushColor: "#000",
      };
   }

   changeBrushColor = (color, event) => {
      this.setState({
         brushColor: color.hex
      })
   }

   changeBrushSize = (value) => {
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
            brushColor={this.state.brushColor}
            
         />
         <p>Brush Size</p>
         <Slider onChange={this.changeBrushSize} defaultValue={1} max={15}/>
         {/* TODO: Find a way to implement or simulate an eraser */}
         <SketchPicker color={this.state.brushColor} onChange={this.changeBrushColor}/>
         {/* <button onClick={() => {this.changeBrushColor("#fff"); this.onBrushSizeChange.bind(this)(12);}}>
            "Eraser"
         </button> */}
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