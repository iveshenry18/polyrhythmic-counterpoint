import { Midi, Track } from '@tonejs/midi'

import { ConversionSettings } from '../pages/conversion_settings_panel';

export async function makePolyrhythmicCounterpoint(
  originalMidi: Midi,
  conversionSettings: ConversionSettings
  ): Promise<Midi> {
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