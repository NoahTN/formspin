import { Component } from 'react';

class ViewerSettings extends Component {
   constructor(props) {
      super(props);
   }

   onModelChange(event) {
      this.props.onChange(event);
   }

   onSizeChange(event) {

   }
   
   onPosChange(event) {

   }

   onRotChange(event) {
      
   }

   render() {
      return <div id="viewer-settings" onChange={this.onModelChange.bind(this)}>
         <input type="radio" value="0" name="Model"/>Sphere
         <input type="radio" value="1" name="Model" defaultChecked/>Cube
         <input type="radio" value="2" name="Model"/>Cylinder
      </div>
   }
}

export default ViewerSettings;