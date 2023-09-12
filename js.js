const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function getNoteMapping(inputName) {
  return NOTE_MAPPING.find(n => n.name === inputName);
}

const activeNotes = new Map(); // Map to store active notes

function soundOn(frequency) {
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = 'sine';
  oscillator.connect(audioContext.destination);
  oscillator.start();
  return oscillator; // Return the oscillator instance
}

const keyboard = document.querySelector("#keyboard");

const NOTE_MAPPING = [
  { id: 60, name: "C", frequency: 261.626, active: false },
  { id: 61, name: "Cb", frequency: 277.183, active: false },
  { id: 62, name: "D", frequency: 293.665, active: false },
  { id: 63, name: "Db", frequency: 311.127, active: false },
  { id: 64, name: "E", frequency: 329.628, active: false },
  { id: 65, name: "F", frequency: 349.228, active: false },
  { id: 66, name: "Fb", frequency: 369.994, active: false },
  { id: 67, name: "G", frequency: 391.995, active: false },
  { id: 68, name: "Gb", frequency: 415.305, active: false },
  { id: 69, name: "A", frequency: 440, active: false },
  { id: 70, name: "Ab", frequency: 466.164, active: false },
  { id: 71, name: "B", frequency: 493.883, active: false }
];


function playNoteFromEvent(event) {
  const inputName = event.target.getAttribute('data-note');
  const note = getNoteMapping(inputName);

  if (note === undefined) return;

  note.active = true;

  if (!activeNotes.has(inputName)) {
    const oscillator = soundOn(note.frequency);
    activeNotes.set(inputName, oscillator); // Store the active note
  }
}

function stopNoteFromEvent(event) {
  const inputName = event.target.getAttribute('data-note');
  const note = getNoteMapping(inputName);

  if (note === undefined) return;

  note.active = false;
  const oscillator = activeNotes.get(inputName);
  if (oscillator) {
    oscillator.stop();
    activeNotes.delete(inputName); // Remove the stopped note from the active notes
  }
}

keyboard.addEventListener('mousedown', playNoteFromEvent);
keyboard.addEventListener('mouseup', stopNoteFromEvent);
keyboard.addEventListener('touchstart', (e) => {
  e.preventDefault();
  playNoteFromEvent(e.touches[0]);
});
keyboard.addEventListener('touchend', (e) => {
  e.preventDefault();
  stopNoteFromEvent(e.changedTouches[0]);
});

// Add an event listener for touchmove to handle note sustain
keyboard.addEventListener('touchmove', (e) => {
  e.preventDefault();
  e.touches.forEach((touch) => {
    playNoteFromEvent(touch);
  });
});