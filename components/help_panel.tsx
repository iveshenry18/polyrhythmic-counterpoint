import SidePanel from "./side_panel";

export default function HelpPanel({ open = false }) {
  return (
    <SidePanel
      open={open}
    >
      <HelpCard title="What is this?">
        <p>A tool for transforming the pitch relationships in a midi file to polyrhythmic relationships based on the frequency ratios of the pitches.
          For a primer on these concepts, check out <a target="_blank" className="underline" href="https://www.youtube.com/watch?v=-tRAkWaeepg">this</a> awesome Ted Talk by Adam Neely.
        </p>
      </HelpCard>
      <HelpCard title="How do I use it?">
        <p>Upload any midi file by clicking "Choose File" or dragging it to the box in the center of the page. Midi files can be exported from most music notation programs and DAWs.
          Here is how to export them from the three most common notation programs:
        </p>
        <ul>
          <li><a href="https://youtu.be/g4JNQc2pS7I?t=106" target="_blank">Sibelius</a></li>
          <li><a href="https://usermanuals.finalemusic.com/Finale2014Mac/Content/Finale/MFTYPDLG.htm?Highlight=export%20midi" target="_blank">Finale</a></li>
          <li><a href="https://steinberg.help/dorico/v2/en/dorico/topics/project_file_handling/project_file_handling_midi_exporting_t.html" target="_blank">Dorico</a></li>
        </ul>
      </HelpCard>
      <HelpCard
        title="What if I want to know boring implementation details?"
      >
        <p>The imported midi is processed in roughly these steps:</p>
        <ol>
          <li>1. The pitch center is found using the key of the midi file</li>
          <li>2. A Quarter Note Pitch is chosen by finding a tonic in the middle of the track's range</li>
          <li>3. The duration of each note (and event) is extended by the Rhythm Multiplier</li>
          <li>4. Each extended note is replaced by a series of repeated notes whose duration is derived from the pitch's
            (<a href="https://www.audiolabs-erlangen.de/resources/MIR/FMP/C5/C5S1_Intervals.html" target="_blank">just intonation</a>)
            frequency ratio with the Quarter Note Pitch.
          </li>
        </ol>
      </HelpCard>
    </SidePanel>
  )
}

function HelpCard({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl mb-1">{title}</h3>
      {children}
    </div>
  )
}