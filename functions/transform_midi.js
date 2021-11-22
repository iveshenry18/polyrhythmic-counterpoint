import { Midi, Track } from '@tonejs/midi'

export async function makePolyrhythmicCounterpoint(originalMidi) {
  let newMidi = new Midi();
  
  // MOCK
  const exampleTrack = newMidi.addTrack();
  exampleTrack.addNote({
    midi: 60,
    time: 0,
    duration: 0.2
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return newMidi;
}