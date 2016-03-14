function MidiDrawer(midiFile) {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var keys = new Array(128);
	var keyboard = [0,1,0,1,0,0,1,0,1,0,1,0];
	var totalDuration = 0;

	var tracks = [];

	for (var i = 0; i < 128; ++i) {
		keys[i] = {duration: 0, occurences: 0};
	}

	for (var i = 0; i < midiFile.tracks.length; i++) {
		var track = [];
		tracks.push(track);
		var miditrack = midiFile.tracks[i];
		for (var j = 0; j < miditrack.length; ++j) {
			evt = miditrack[j];
			if (evt.subtype === 'noteOn') {
				noteOn(track, evt);
			} else if (evt.subtype === 'noteOff') {
				noteOff(track, evt);
			}
		}
	}

	for (var i = 0; i < tracks.length; i++) {
		var track = tracks[i];
		for (var j = 0; j < track.length; ++j) {
			var note = track[j];
			var key = keys[note.noteNumber];
			key.duration += note.duration;
			++key.occurences;

			if (note.end > totalDuration) {
				totalDuration = note.end;
			}
		}
	}

	function noteOn(track, evt) {
		if (evt.velocity == 0) {
			noteOff(track, evt);
		}
		var lastNote = getLastNote(track);
		track.push({noteNumber: evt.noteNumber, start: evt.deltaTime + (lastNote.end == null ? lastNote.start : lastNote.end), duration: null, end: null, velocity: evt.velocity});
	}

	function noteOff(track, evt) {
		var lastOccurence = getLastOccurence(track, evt.noteNumber);
		lastOccurence.duration = evt.deltaTime;
		lastOccurence.end = lastOccurence.duration + lastOccurence.start;
	}

	function getLastNote(track) {
		if (track.length == 0) return {end: 0};
		return track[track.length - 1];
	}

	function getLastOccurence(track, noteNumber) {
		for (var i = track.length - 1; i >= 0; --i) {
			if (track[i].noteNumber == noteNumber) {
				return track[i];
			}
		}
		return null;
	}

	function getLastOccurence(track, noteNumber) {
		for (var i = track.length - 1; i >= 0; --i) {
			if (track[i].noteNumber == noteNumber) {
				return track[i];
			}
		}
		return {end: 0};
	}
	
	function draw(type) {
		context.clearRect(0, 0, canvas.width, canvas.height);

		if (type === 'partition') {
			var thickness = 5;
			var space = 6;

			for (var i = 0; i < tracks.length; ++i) {
				var track = tracks[i];
				for (var j = 0; j < track.length; ++j) {
					// draw notes
					var note = track[j];
					context.beginPath();
					context.rect(note.start / 10, note.noteNumber * space, note.duration / 10, thickness);
					context.fillStyle = 'rgba(255, 0, 0, 1)';
					context.fill();
				}
			}
		} else if (type === 'circle') {
			var thickness = 1;
			var space = 4;
			var centerX = canvas.width / 2;
			var centerY = canvas.height / 2;
			var twoPi = 2 * Math.PI;

			for (var i = 0; i < tracks.length; ++i) {
				var track = tracks[i];
				for (var j = 0; j < track.length; ++j) {
					// draw notes
					var note = track[j];
					
					a1 = note.start / totalDuration * twoPi;
					a2 = note.end / totalDuration * twoPi;
					
					context.beginPath();
					context.arc(centerX, centerY, note.noteNumber * space, a1, a2);
					context.lineWidth = 2;
					context.stroke();
				}
			}
		} else if (type === 'duration') {
			var space = 10;
			var centerY = canvas.height / 2;

			for (var i = 0; i < keys.length; ++i) {

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
				context.arc(centerX, y, Math.sqrt(keys[i].duration / 100 / Math.PI) * 5, 0, 2 * Math.PI, false);
				context.fillStyle = 'rgba(255, 0, 0, .3)';
				context.fill();
			}
		}
	}

	draw('duration');
	
	return self;
}
