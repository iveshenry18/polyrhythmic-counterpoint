import { Midi, Track } from '@tonejs/midi'
import { Note } from '@tonejs/midi/dist/Note';

import { ConversionSettings } from '../components/conversion_settings_panel';
import { intervalToHarmonicRatio, pitchClassToMidi } from './music_utilities';

const modifyMidiHeader = (
  newMidi: Midi,
  conversionSettings: ConversionSettings
) => {
  newMidi.header.keySignatures.forEach((keySignature) => {
    keySignature.ticks *= conversionSettings.rhythmMultiplier;
  })
  newMidi.header.meta.forEach((meta) => {
    meta.ticks *= conversionSettings.rhythmMultiplier
  })

  if (conversionSettings.tempo !== -1) {
    newMidi.header.setTempo(conversionSettings.tempo);
  } else {
    newMidi.header.tempos.forEach((tempo) => {
      tempo.ticks *= conversionSettings.rhythmMultiplier
    })
  }
  newMidi.header.update();

  newMidi.header.timeSignatures.forEach((timeSignature) => {
    timeSignature.ticks *= conversionSettings.rhythmMultiplier
  })
  newMidi.header.update();
}

const modifyTrack = (
  newTrack: Track,
  conversionSettings: ConversionSettings) => {

  // TODO: handle control changes
  // originalTrack.controlChanges.forEach((originalControlChange) => {
  //   newTrack.addCC({
  //     number: originalControlChange.number,
  //     value: originalControlChange.value,
  //     ticks: originalControlChange.ticks * conversionSettings.rhythmMultiplier,
  //     time: originalControlChange.time * conversionSettings.rhythmMultiplier,
  //   });
  // });

  newTrack.pitchBends.forEach((pitchBend) => {
    pitchBend.ticks *= conversionSettings.rhythmMultiplier,
      pitchBend.time *= conversionSettings.rhythmMultiplier
  })
}

const calculateNoteDuration = (
  originalNote: Note,
  quarterNotePitch: number,
  ppq: number
) => {
  const midiInterval = originalNote.midi - quarterNotePitch;
  const harmonicRatio = intervalToHarmonicRatio(midiInterval);
  return Math.round(harmonicRatio.mul(ppq).valueOf());
}

const getCurrentMidiKey = (midi: Midi, currentTick: number): number => {
  midi.header.keySignatures.slice().reverse().forEach((keySignature) => {
    if (keySignature.ticks < currentTick) {
      return pitchClassToMidi(keySignature.key);
    }
  })
  return 0;
}

const getMidiRange = (midi: Midi): [number, number] => {
  let lowestNote = 127;
  let highestNote = 0;
  midi.tracks.forEach((track) => {
    track.notes.forEach((note) => {
      lowestNote = note.midi < lowestNote ? note.midi : lowestNote;
      highestNote = note.midi > highestNote ? note.midi : highestNote;
    })
  })

  if (lowestNote > highestNote) return [null, null];
  return [lowestNote, highestNote];
}

const getMidRangePitchCenter = (
  conversionSettings: ConversionSettings,
  midi: Midi,
  currentTick: number): number => {
  const functionalPitchCenter: number = conversionSettings.pitchCenter === 'default' || !conversionSettings.pitchCenter
    ? getCurrentMidiKey(midi, currentTick)
    : pitchClassToMidi(conversionSettings.pitchCenter);
  const [lowestNote, highestNote] = getMidiRange(midi);
  const middleNote = Math.round(lowestNote + (highestNote - lowestNote) / 2);
  const middleOctave = Math.floor(middleNote / 12);
  const pitchCenterBelow = (middleOctave - 1) * 12 + functionalPitchCenter;
  const pitchCenterAbove = middleOctave * 12 + functionalPitchCenter; 
  const closestPitchCenter = Math.abs(pitchCenterAbove - middleNote) < Math.abs(pitchCenterBelow - middleNote) ? pitchCenterAbove : pitchCenterBelow; 
  return closestPitchCenter;
}

const makeNotes = (
  newTrack: Track,
  originalNote: Note,
  conversionSettings: ConversionSettings,
  newMidi: Midi
) => {
  let currentTick = originalNote.ticks * conversionSettings.rhythmMultiplier;
  const finalTick = originalNote.ticks * conversionSettings.rhythmMultiplier
    + originalNote.durationTicks * conversionSettings.rhythmMultiplier;
  const functionalQuarterNotePitch = conversionSettings.quarterNotePitch == -1
    ? getMidRangePitchCenter(conversionSettings, newMidi, currentTick)
    : conversionSettings.quarterNotePitch;
  while (currentTick < finalTick) {
    const durationTicks = calculateNoteDuration(originalNote, functionalQuarterNotePitch, newMidi.header.ppq);
    newTrack.addNote({
      midi: originalNote.midi,
      name: originalNote.name,
      octave: originalNote.octave,
      pitch: originalNote.pitch,
      velocity: originalNote.velocity,
      noteOffVelocity: originalNote.noteOffVelocity,
      ticks: currentTick,
      durationTicks: durationTicks,
      // time: originalNote.time * conversionSettings.rhythmMultiplier,
      // duration: ???
    })
    currentTick += durationTicks;
  }
}

export async function makePolyrhythmicCounterpoint(
  originalMidi: Midi,
  conversionSettings: ConversionSettings
): Promise<Midi> {

  // Create new Midi using data from original (deep copy(?))
  let newMidi = new Midi(originalMidi.toArray());

  modifyMidiHeader(newMidi, conversionSettings);

  newMidi.tracks.forEach((track) => {
    // TODO: handle this now that all data is copied.
    modifyTrack(track, conversionSettings);
    for (let i = track.notes.length - 1; i >= 0; i--) {
      const originalNote = track.notes.splice(i, 1)[0];
      makeNotes(track, originalNote, conversionSettings, newMidi);
    }

  })

  return newMidi;
}