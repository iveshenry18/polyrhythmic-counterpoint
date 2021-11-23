import { useState } from 'react';
import { AdjustmentsIcon, CodeIcon } from '@heroicons/react/outline';

import { Midi } from '@tonejs/midi';
import { makePolyrhythmicCounterpoint } from '../functions/convert_midi';

import { ObjectPanel } from './object_viewer_panel';
import ConversionSettingPanel, { ConversionSettings } from './conversion_settings_panel';

export default function Home() {
  const [inputMidi, setInputMidi]: [Midi, Function] = useState(null); // Might not be so necessary
  const [outputMidi, setOutputMidi]: [Midi, Function] = useState(null);
  const [settingsOpen, setSettingsOpen]: [boolean, Function] = useState(false);
  const [codeOpen, setCodeOpen]: [boolean, Function] = useState(false);
  const [conversionSettings, setConversionSettings]: [ConversionSettings, Function] = useState({
    pitchCenter: null,
    lowestPitch: null,
    rhythmMultiplier: 4,
    tempo: null,
  });

  const handleMidiDrop = async (event) => {
    if (!event.target.files.length) {
      setInputMidi(null);
      return;
    }
    console.log(event);
    const originalMidi = await Midi.fromUrl(URL.createObjectURL(event.target.files[0]));
    setInputMidi(originalMidi);
    const newMidi = await makePolyrhythmicCounterpoint(originalMidi, conversionSettings);
    setOutputMidi(newMidi);
    console.log(originalMidi);
    console.log(newMidi);
    return;
  }

  return (
    <div className="flex flex-row items-stretch h-screen w-screen">
      {inputMidi && outputMidi &&
        <button
          className="fixed left-4 bottom-4 z-10"
          onClick={() => (setCodeOpen((prevCodeOpen) => (!prevCodeOpen)))}>
          <CodeIcon className={`h-8 w-8 ${codeOpen ? "black" : "text-gray-400 hover:text-gray-500"}`} />
        </button>
      }
      {codeOpen &&
        <ObjectPanel
          inputMidi={inputMidi}
          outputMidi={outputMidi} />
      }
      <div className="flex flex-col items-center justify-center h-screen max-h-screen w-screen max-w-screen gap-3">
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
                href={URL.createObjectURL(new Blob([outputMidi.toArray()], { type: "audio/midi" }))}
                download="polyrhythmic_counterpoint.mid"
              >Download</a>}
        </div>
        <button
          className="fixed right-4 bottom-4 z-10"
          onClick={() => (setSettingsOpen((prevSettingsOpen) => (!prevSettingsOpen)))}>
          <AdjustmentsIcon className={`h-8 w-8 ${settingsOpen ? "black" : "text-gray-400 hover:text-gray-500"}`} />
        </button>
      </div>
      {settingsOpen &&
        <ConversionSettingPanel
          conversionSettings={conversionSettings}
          setConversionSettings={setConversionSettings}
        />
      }
    </div>
  )
}
