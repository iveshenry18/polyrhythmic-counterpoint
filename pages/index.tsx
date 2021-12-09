import { useEffect, useState } from 'react';
import { AdjustmentsIcon, CodeIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';

import { Midi } from '@tonejs/midi';
import { makePolyrhythmicCounterpoint } from '../functions/convert_midi';

import ObjectPanel from '../components/object_viewer_panel';
import HelpPanel from '../components/help_panel';
import ConversionSettingPanel, { ConversionSettings } from '../components/conversion_settings_panel';
import { PanelIconButton } from '../components/side_panel';


enum Menu {
  NONE = 0,
  HELP,
  SETTINGS,
  CODE
}

export default function Home() {
  const [inputMidiName, setInputMidiName] = useState<string>("");
  const [inputMidi, setInputMidi] = useState<Midi>(null); // Might not be so necessary
  const [outputMidi, setOutputMidi] = useState<Midi>(null);
  const [openMenu, setOpenMenu] = useState<Menu>(Menu.NONE);
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    pitchCenter: null,
    quarterNotePitch: -1,
    rhythmMultiplier: 4,
    tempo: -1,
  });

  useEffect(() => {
    updateOutputMidi()
  }, [inputMidi, conversionSettings])

  const updateOutputMidi = async () => {
    if (!inputMidi) return;
    // console.log(`Updating Output Midi\nInput file: ${inputMidiName}\nConversion Settings:`);
    // console.log(conversionSettings);
    const newMidi = await makePolyrhythmicCounterpoint(inputMidi, conversionSettings);
    setOutputMidi(newMidi);
  }

  const handleMidiDrop = async (event) => {
    if (!event.target.files.length || !event.target.files[0].name.endsWith(".mid")) {
      setInputMidi(null);
      setInputMidiName("");
      return;
    }
    const originalMidi = await Midi.fromUrl(URL.createObjectURL(event.target.files[0]));
    setInputMidiName(event.target.files[0].name.replace(".mid", ""));
    setInputMidi(originalMidi);
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
                className="bg-blue-700 text-white p-2 no-underline"
                href={URL.createObjectURL(new Blob([outputMidi.toArray()], { type: "audio/midi" }))}
                download={`Polyrhythmic Counterpoint - ${inputMidiName} [${new Date(Date.now()).toISOString()}].mid`}
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
