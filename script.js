'use strict';

var context = new AudioContext()


class Metronome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bpm: 100,
			label: "Start"
		}
		this.running = false;
	}

	bpmChange(event) {
		const bpm = event.target.value;
		this.setState({bpm})
	}

	startStop(event) {
		event.preventDefault();
		if (!this.running) {
			this.running = true;
			this.play();
			this.setState({label: "Stop"});
		} else {
			this.running = false;
			this.setState({label: "Start"});
		}
	}

	play() {
		var self = this;

		return new Promise(
			function(resolve, reject) {
				self.playSound();	

				const mili = 60/self.state.bpm * 1000;
				setTimeout(
					function() {
						if (self.running) {
							resolve();
						}
					}, 
					mili
				);
			}
		).then(this.play.bind(this));
	}

	playSound() {
		var o = context.createOscillator()
		o.frequency.value = 200;
		var g = context.createGain()
		o.connect(g)
		g.connect(context.destination)
		o.start(context.currentTime)
		g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.01)
	}

	render() {
		return 	<div>
					<form>
						<p>{this.state.bpm} BPM</p>
						<input type="range" className="form-control-range" min="30" max="300" value={this.state.bpm} onChange={this.bpmChange.bind(this)} />
						<button onClick={this.startStop.bind(this)}>{this.state.label}</button>
					</form>

				</div>
	}
}

ReactDOM.render(<Metronome />, document.getElementById('metronome'));