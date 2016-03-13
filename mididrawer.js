function MidiDrawer(midiFile) {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var keyboard = [0,1,0,1,0,0,1,0,1,0,1,0];

	var noteOccurences = new Array(128);
	for (var i = 0; i < 128; ++i) {
		noteOccurences[i] = 0;
	}

	for (var i = 0; i < midiFile.tracks.length; i++) {
		var track = midiFile.tracks[i];
		for (var j = 0; j < track.length; ++j) {
			evt = track[j];
			if (evt.subtype === 'noteOn') {
				++noteOccurences[evt.noteNumber]; //velocity
			}
		}
	}
	
	function redraw() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		var space = 10;
		var centerY = canvas.height / 2;

		for (var i = 0; i < noteOccurences.length; ++i) {

			// draw note
			var centerX = space * i;
			var lineX = centerX + space / 2;
			var blackkey = keyboard[i % 12];
			var y = centerY - blackkey * 20;

			context.beginPath();
			context.moveTo(lineX, 0);
			context.lineTo(lineX, canvas.height);
			context.lineWidth = .1;
			context.stroke();

			context.beginPath();
			context.arc(centerX, y, Math.sqrt(noteOccurences[i] / Math.PI) * 5, 0, 2 * Math.PI, false);
			context.fillStyle = 'rgba(255, 0, 0, .3)';
			context.fill();
			//context.strokeStyle = 'rgba(255, 0, 0, .3)';
			//context.stroke();
		}
	}

	redraw();
	
	return self;
}
