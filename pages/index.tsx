import { useState } from 'react';
import { AdjustmentsIcon, CodeIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';

import { Midi } from '@tonejs/midi';
import { makePolyrhythmicCounterpoint } from '../functions/convert_midi';

import { ObjectPanel } from './object_viewer_panel';
import HelpPanel from './help_panel';
import ConversionSettingPanel, { ConversionSettings } from './conversion_settings_panel';
import { PanelIconButton } from './side_panel';


enum Menu {
  NONE = 0,
  HELP,
  SETTINGS,
  CODE
}

export default function Home() {
  const [inputMidi, setInputMidi] = useState<Midi>(null); // Might not be so necessary
  const [outputMidi, setOutputMidi] = useState<Midi>(null);
  const [openMenu, setOpenMenu] = useState<Menu>(Menu.NONE);
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
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

  const toggleMenu = (menu: Menu) => (
    () => {setOpenMenu((prevOpenMenu) => (prevOpenMenu === menu ? Menu.NONE : menu))}
  )

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
        open={openMenu === Menu.SETTINGS}
        conversionSettings={conversionSettings}
        setConversionSettings={setConversionSettings}
      />
      <ObjectPanel
        open={openMenu === Menu.CODE}
        inputMidi={inputMidi}
        outputMidi={outputMidi}
      />
      <HelpPanel
        open={openMenu === Menu.HELP}
      />
      <div className="flex flex-col justify-start gap-4 p-4">
        <PanelIconButton
          panelOpen={openMenu === Menu.HELP}
          setPanelOpen={toggleMenu(Menu.HELP)} 
          Icon={QuestionMarkCircleIcon}
        />
        <PanelIconButton
          panelOpen={openMenu === Menu.SETTINGS}
          setPanelOpen={toggleMenu(Menu.SETTINGS)}
          Icon={AdjustmentsIcon}
        />
        {inputMidi && outputMidi &&
          <PanelIconButton
            panelOpen={openMenu === Menu.CODE}
            setPanelOpen={toggleMenu(Menu.CODE)}
            Icon={CodeIcon}
          />
        }
      </div>
    </div>
  )
}
