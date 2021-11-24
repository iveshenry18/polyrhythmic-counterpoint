import { useState } from 'react';
import { AdjustmentsIcon, CodeIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';

import { Midi } from '@tonejs/midi';
import { makePolyrhythmicCounterpoint } from '../functions/convert_midi';

import { ObjectPanel } from './object_viewer_panel';
import HelpPanel from './help_panel';
import ConversionSettingPanel, { ConversionSettings } from './conversion_settings_panel';
import { IconButton, PanelIconButton } from './side_panel';

export default function Home() {
  const [inputMidi, setInputMidi]: [Midi, Function] = useState(null); // Might not be so necessary
  const [outputMidi, setOutputMidi]: [Midi, Function] = useState(null);
  const [settingsOpen, setSettingsOpen]: [boolean, Function] = useState(false);
  const [codeOpen, setCodeOpen]: [boolean, Function] = useState(false);
  const [helpOpen, setHelpOpen]: [boolean, Function] = useState(false);
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
    <div className="flex flex-row items-stretch h-screen w-screen relative">
      <div className="flex flex-col items-center justify-center h-screen max-h-screen w-screen max-w-screen gap-3 relative">
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
      </div>
      <ConversionSettingPanel
        open={settingsOpen}
        conversionSettings={conversionSettings}
        setConversionSettings={setConversionSettings}
      />
      <ObjectPanel
        open={codeOpen}
        inputMidi={inputMidi}
        outputMidi={outputMidi}
      />
      <HelpPanel
        open={helpOpen}
      />
      <div className="flex flex-col justify-start gap-4 p-4">
        <PanelIconButton
          panelOpen={helpOpen}
          setPanelOpen={setHelpOpen}
          Icon={QuestionMarkCircleIcon}
        />
        <PanelIconButton
          panelOpen={settingsOpen}
          setPanelOpen={setSettingsOpen}
          Icon={AdjustmentsIcon}
        />
        {inputMidi && outputMidi &&
          <PanelIconButton
            panelOpen={codeOpen}
            setPanelOpen={setCodeOpen}
            Icon={CodeIcon}
          />
        }
      </div>
    </div>
  )
}
