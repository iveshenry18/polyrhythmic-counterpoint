import Fraction from 'fraction.js';

const noteToScaleIndex: { [name: string]: number } = {
  // tslint:disable-next-line: object-literal-sort-keys
  Cbb: -2, Cb: -1, C: 0, "C#": 1, Cx: 2,
  Dbb: 0, Db: 1, D: 2, "D#": 3, Dx: 4,
  Ebb: 2, Eb: 3, E: 4, "E#": 5, Ex: 6,
  Fbb: 3, Fb: 4, F: 5, "F#": 6, Fx: 7,
  Gbb: 5, Gb: 6, G: 7, "G#": 8, Gx: 9,
  Abb: 7, Ab: 8, A: 9, "A#": 10, Ax: 11,
  Bbb: 9, Bb: 10, B: 11, "B#": 12, Bx: 13,
};

export const pitchClassToMidi = (pitchClass: string): number => {
  return noteToScaleIndex[pitchClass] % 12;
}

export const pitchClassNames: string[] = Object.keys(noteToScaleIndex);

// Just Intonation intervals from https://www.audiolabs-erlangen.de/resources/MIR/FMP/C5/C5S1_Intervals.html
const harmonicRatioDictionary: { [key: number]: Fraction } = {
  0: new Fraction(1, 1),
  1: new Fraction(15, 16),
  2: new Fraction(8, 9),
  3: new Fraction(5, 6),
  4: new Fraction(4, 5),
  5: new Fraction(3, 4),
  6: new Fraction(32, 45),
  7: new Fraction(2, 3),
  8: new Fraction(5, 8),
  9: new Fraction(3, 5),
  10: new Fraction(5, 9),
  11: new Fraction(8, 15),
}

export const intervalToHarmonicRatio = (midiInterval: number): Fraction => {
  let pitchClassInterval = midiInterval % 12;
  const octaveInterval = Math.floor(midiInterval / 12);
  let negative = false;

  if (pitchClassInterval < 0) {
    negative = true;
    pitchClassInterval = Math.abs(pitchClassInterval);
  }
  let pitchClassHarmonicRatio = harmonicRatioDictionary[pitchClassInterval];
  if (negative) {
    pitchClassHarmonicRatio = pitchClassHarmonicRatio.inverse();
  }
  return pitchClassHarmonicRatio.mul(2 ** -octaveInterval);
}