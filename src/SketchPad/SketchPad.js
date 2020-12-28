import { Component } from 'react';
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";

class SketchPad extends Component{
   render() {
      return <div id="sketch-pad">
         <CanvasDraw canvasWidth={650} canvasHeight={650}/>
      </div>
   }
}

export default SketchPad;