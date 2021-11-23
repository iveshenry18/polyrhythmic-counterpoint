const noteNames: string[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G"
];

const accidentals: string[] = [
  "",
  "#",
  "b"
];

export const pitchClassNames: string[] = noteNames.flatMap((noteName) => (
  accidentals.flatMap((accidental) => (
    `${noteName}${accidental}`
  ))
));