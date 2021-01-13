import { Component } from 'react';
import * as THREE from 'three';

class Randomizer extends Component {
   constructor(props) {
      super(props)
   }

   componentDidMount() {

   }

   render() {
      return (
         <div id="randomizer-settings" class="settings-panel">
            <div>
               <input type="radio" name="test"/>setting1
               <input type="radio" name= "test"/>setting2
            </div>
         </div>
      )
   }
}

export default Randomizer;