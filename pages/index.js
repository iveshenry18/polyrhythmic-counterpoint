import { useState } from 'react';
import { Midi } from '@tonejs/midi';
import { makePolyrhythmicCounterpoint } from '../functions/transform_midi';

export default function Home() {
  const [inputMidi, setInputMidi] = useState(null); // Might not be so necessary
  const [outputMidi, setOutputMidi] = useState(null);

  const handleMidiDrop = async (event) => {
    if (!event.target.files.length) {
      setInputMidi(null);
      return;
    }
    console.log(event);
    const originalMidi = await Midi.fromUrl(URL.createObjectURL(event.target.files[0]));
    setInputMidi(originalMidi);
    const newMidi = await makePolyrhythmicCounterpoint(originalMidi);
    setOutputMidi(newMidi);
    console.log(originalMidi);
    console.log(newMidi);
    return;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-3">
      <h1 className="text-center font-serif text-4xl">Polyrhythmic Counterpoint</h1>
      <div className="border-2 border-dotted">
        <input
          type="file"
          accept="audio/midi"
          onChange={handleMidiDrop}
          />
      </div>
      <div className="min-h-10 min-w-20 p-2">
      {!inputMidi
        ? <div className="cursor-not-allowed bg-gray-600 text-white p-2">Upload Midi Above</div>
        : !outputMidi
        ? <div className="cursor-wait p-2">processing...</div>
        : <a
          className="bg-blue-700 text-white p-2"
          href={URL.createObjectURL(new Blob([outputMidi.toArray()], {type: "audio/midi"}))}
          download="polyrhythmic_counterpoint.mid"
          >Download</a>}
      </div>
    </div>
  )
}
