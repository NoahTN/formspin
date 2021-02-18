import { Component } from 'react';
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import { ChromePicker } from 'react-color';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class SketchPad extends Component{
   constructor(props) {
      super(props);
      this.state = {
         brushSize: 5,
         brushColor: "#000",
         mouseIsDown: false
      };
   }

  componentDidMount() {
      document.onmousedown = this.onDocMouseDown;
      document.onmouseup = this.onDocMouseUp;
  }

   onCanvasMouseOver = (event) => {
      if(this.state.mouseIsDown) {
         this.drawCanvas.handleDrawStart(event);
      }
   }

   onDocMouseDown = () => {
      this.state.mouseIsDown = true;
   }

   onDocMouseUp = () => {
      this.state.mouseIsDown = false;
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
   
   wheelHandler = (event) => {
      // Scroll Down
      if(event.deltaY > 0) {
         this.changeBrushSize(Math.max(this.state.brushSize-1, 1))
      }
      // Scroll Up
      else {
         this.changeBrushSize(Math.min(this.state.brushSize+1, 15))
      }
      
   }

   render() {
      return <div id="sketch-pad" onWheel={this.wheelHandler}>
         <div id="canvas-wrap" onMouseOver={this.onCanvasMouseOver}>
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
         </div>
         <p>Brush Size</p>
         <Slider onChange={this.changeBrushSize} value={this.state.brushSize} defaultValue={1} max={15}/>
         <ChromePicker color={this.state.brushColor} onChange={this.changeBrushColor}/>
         <button onClick={() => {this.changeBrushColor( {"hex": "#fff"} )}}>
            Eraser
         </button>
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