import { Midi, Track } from '@tonejs/midi'
import { ControlChange } from '@tonejs/midi/dist/ControlChange';
import { KeySignatureEvent, MetaEvent, TempoEvent, TimeSignatureEvent } from '@tonejs/midi/dist/Header';
import { Note } from '@tonejs/midi/dist/Note';

import { ConversionSettings } from '../pages/conversion_settings_panel';

const copyMidiHeader = (
  originalMidi: Midi,
  newMidi: Midi,
  conversionSettings: ConversionSettings
) => {
  newMidi.header.name = originalMidi.header.name;
  originalMidi.header.keySignatures.forEach((originalKeySignature) => {
    const newKeySignature: KeySignatureEvent = {
      key: originalKeySignature.key,
      scale: originalKeySignature.scale,
      ticks: originalKeySignature.ticks * conversionSettings.rhythmMultiplier
    }
    newMidi.header.keySignatures.push(newKeySignature);
  })
  originalMidi.header.meta.forEach((originalMeta) => {
    const newMeta: MetaEvent = {
      text: originalMeta.text,
      type: originalMeta.type,
      ticks: originalMeta.ticks * conversionSettings.rhythmMultiplier
    }
    newMidi.header.meta.push(newMeta);
  })
  
  if (conversionSettings.tempo !== -1) {
    newMidi.header.setTempo(conversionSettings.tempo);
  } else {
    originalMidi.header.tempos.forEach((originalTempo) => {
      const newTempo: TempoEvent = {
        bpm: originalTempo.bpm,
        time: originalTempo.time,
        ticks: originalTempo.ticks * conversionSettings.rhythmMultiplier
      }
      newMidi.header.tempos.push(newTempo);
    })
  }
  newMidi.header.update();
  
  originalMidi.header.timeSignatures.forEach((originalTimeSignature) => {
    const newTimeSignature: TimeSignatureEvent = {
      timeSignature: originalTimeSignature.timeSignature,
      measures: originalTimeSignature.measures,
      ticks: originalTimeSignature.ticks * conversionSettings.rhythmMultiplier
    }
    newMidi.header.timeSignatures.push(newTimeSignature);
  })
  newMidi.header.update();
}

const copyTrackSettings = (
  originalTrack: Track,
  newTrack: Track,
  conversionSettings: ConversionSettings) => {
    newTrack.channel = originalTrack.channel;
    newTrack.instrument = originalTrack.instrument;
    newTrack.name = originalTrack.name;
    originalTrack.controlChanges.array.forEach((originalControlChange) => {
      newTrack.addCC({
        number: originalControlChange.number,
        value: originalControlChange.value,
        ticks: originalControlChange.ticks * conversionSettings.rhythmMultiplier,
        time: originalControlChange.time * conversionSettings.rhythmMultiplier,
      });
    });
    originalTrack.pitchBends.forEach((originalPitchBend) => {
      newTrack.addPitchBend({
        value: originalPitchBend.value,
        ticks: originalPitchBend.ticks * conversionSettings.rhythmMultiplier,
        time: originalPitchBend.time * conversionSettings.rhythmMultiplier
      })
    })
}

const calculateNoteDuration = (
  originalNote: Note,
  conversionSettings: ConversionSettings
) => {
  return 10; // haha
}

const makeNotesFromMetaNote = (
  newTrack: Track,
  originalNote: Note,
  metaNote: Note,
  conversionSettings: ConversionSettings
) => {
  let currentTick = originalNote.ticks * conversionSettings.rhythmMultiplier;
  const finalTick = originalNote.ticks * conversionSettings.rhythmMultiplier
                  + originalNote.durationTicks * conversionSettings.rhythmMultiplier;
  while (currentTick < finalTick) {
    newTrack.addNote({
      midi: originalNote.midi,
      name: originalNote.name,
      octave: originalNote.octave,
      pitch: originalNote.pitch,
      ticks: currentTick,
      time: originalNote.time * conversionSettings.rhythmMultiplier,
      velocity: originalNote.velocity,
      noteOffVelocity: originalNote.noteOffVelocity,
      durationTicks: calculateNoteDuration(originalNote, conversionSettings),
      // duration: ???
    })
  }
}

export async function makePolyrhythmicCounterpoint(
  originalMidi: Midi,
  conversionSettings: ConversionSettings
  ): Promise<Midi> {

  let newMidi = new Midi();
  copyMidiHeader(originalMidi, newMidi, conversionSettings);

  originalMidi.tracks.forEach((originalTrack) => {
    const newTrack = newMidi.addTrack()
    copyTrackSettings(originalTrack, newTrack, conversionSettings);
    originalTrack.notes.forEach((originalNote) => {
      const metaNote: Note = {
        duration: originalNote.duration * conversionSettings.rhythmMultiplier,
        durationTicks: originalNote.durationTicks * conversionSettings.rhythmMultiplier,
        midi: originalNote.midi,
        name: originalNote.name,
        octave: originalNote.octave,
        noteOffVelocity: originalNote.noteOffVelocity,
        pitch: originalNote.pitch,
        ticks: originalNote.ticks * conversionSettings.rhythmMultiplier,
        time: originalNote.time * conversionSettings.rhythmMultiplier,
        velocity: originalNote.velocity,
        bars: originalNote.bars, // ???
        toJSON: originalNote.toJSON
      }
      makeNotesFromMetaNote(newTrack, originalNote, metaNote, conversionSettings);
    })

  })
  
  // // MOCK
  // const exampleTrack = newMidi.addTrack();
  // exampleTrack.addNote({
  //   midi: 60,
  //   time: 0,
  //   duration: 0.2
  // });
  // await new Promise(resolve => setTimeout(resolve, 1000));
  
  return newMidi;
}