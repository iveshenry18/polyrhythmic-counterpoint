import Fraction from 'fraction.js';

const noteNames = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G"
];

const accidentals = [
  "",
  "#",
  "b"
];

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

export const pitchClassNames: string[] = noteNames.flatMap((noteName) => (
  accidentals.flatMap((accidental) => (
    `${noteName}${accidental}`
  ))
));

export const intervalToHarmonicRatio = (midiInterval: number): Fraction => {
  const pitchClassInterval = midiInterval % 12;
  const octaveInterval = Math.floor(midiInterval / 12);

  const pitchClassHarmonicRatio = harmonicRatioDictionary[pitchClassInterval];
  return pitchClassHarmonicRatio.mul(2 ** octaveInterval); 
}