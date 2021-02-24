import { Component } from 'react';

class Timer extends Component {
   constructor(props) {
     super(props);
     this.state = { time: {} };
     this.timer = 0;
     this.startTimer = this.startTimer.bind(this);
     this.countDown = this.countDown.bind(this);
   }
 
   secondsToTime(secs){
     let hours = Math.floor(secs / (60 * 60));
 
     let divisor_for_minutes = secs % (60 * 60);
     let minutes = Math.floor(divisor_for_minutes / 60);
 
     let divisor_for_seconds = divisor_for_minutes % 60;
     let seconds = Math.ceil(divisor_for_seconds);
 
     let obj = {
       "h": hours,
       "m": minutes,
       "s": seconds
     };
     return obj;
   }
 
   componentDidMount() {
     let timeLeftVar = this.secondsToTime(this.props.seconds);
     this.setState({ time: timeLeftVar });
   }
 
   startTimer() {
     if (this.timer === 0 && this.props.seconds > 0) {
       this.timer = setInterval(this.countDown, 1000);
     }
   }
 
   countDown() {
     // Remove one second, set state so a re-render happens.
     let seconds = this.props.seconds - 1;
     this.setState({
       time: this.secondsToTime(seconds),
     });
     this.props.updateSeconds({"target": {"value": seconds}})
     // Check if we're at zero.
     if (seconds === 0) { 
       clearInterval(this.timer);
       // TODO: Possibly reset timer and start again here
     }
   }
 
   render() {
     return(
       <div style={{display: this.state.time.s > 0 ? 'block' : 'none'}}>
         m: {this.state.time.m} s: {this.state.time.s}
       </div>
     );
   }
 }
 
 export default Timer;