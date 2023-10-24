import { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import { Midi } from "@tonejs/midi";
import { makePolyrhythmicCounterpoint } from "../functions/convert_midi";

import ObjectPanel from "../components/object_viewer_panel";
import HelpPanel from "../components/help_panel";
import ConversionSettingPanel, {
  ConversionSettings,
} from "../components/conversion_settings_panel";
import { PanelIconButton } from "../components/side_panel";

enum Menu {
  NONE = 0,
  HELP,
  SETTINGS,
  CODE,
  PLAYBACK,
}

export default function Home() {
  const [inputMidiName, setInputMidiName] = useState<string>("");
  const [inputMidi, setInputMidi] = useState<Midi | null>(null); // Might not be so necessary
  const [outputMidi, setOutputMidi] = useState<Midi | null>(null);
  const [openMenu, setOpenMenu] = useState<Menu>(Menu.NONE);
  const [conversionSettings, setConversionSettings] =
    useState<ConversionSettings>({
      pitchCenter: null,
      quarterNotePitch: -1,
      rhythmMultiplier: 4,
      tempo: -1,
    });

  useEffect(() => {
    const updateOutputMidi = async () => {
      if (!inputMidi) return;
      // console.log(`Updating Output Midi\nInput file: ${inputMidiName}\nConversion Settings:`);
      // console.log(conversionSettings);
      const newMidi = await makePolyrhythmicCounterpoint(
        inputMidi,
        conversionSettings
      );
      setOutputMidi(newMidi);
    };
    updateOutputMidi();
  }, [inputMidi, conversionSettings]);

  const handleMidiDrop = async (event) => {
    if (
      !event.target.files.length ||
      !event.target.files[0].name.endsWith(".mid")
    ) {
      setInputMidi(null);
      setInputMidiName("");
      return;
    }
    const originalMidi = await Midi.fromUrl(
      URL.createObjectURL(event.target.files[0])
    );
    setInputMidiName(event.target.files[0].name.replace(".mid", ""));
    setInputMidi(originalMidi);
    return;
  };

  const toggleMenu = (menu: Menu) => () => {
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === menu ? Menu.NONE : menu));
  };

  return (
    <div className="h-screen w-screen relative">
      <div className="absolute flex flex-col items-center justify-center h-screen max-h-screen w-screen max-w-screen gap-8">
        <span className="bg-gradient-to-r from-gray-600 via-gray-900 via-30% to-gray-600 to-60% inline-block px-2 text-transparent bg-clip-text p-2">
          <h1 className="text-center font-serif font-semibold text-7xl ">
            Polyrhythmic Counterpoint
          </h1>
        </span>
        <div className="h-16 min-w-20 p-4">
          {!inputMidi ? (
            <div className="flex flex-row items-center justify-center">
              <input
                type="file"
                accept="audio/midi"
                onChange={handleMidiDrop}
              />
            </div>
          ) : !outputMidi ? (
            <div className="cursor-wait p-2 h-12 w-12">
              <ArrowPathIcon className="animate-spin" />
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-4">
              <div className="">
                <a
                  className="bg-blue-700 hover:bg-blue-800 text-white p-3 no-underline text-lg rounded-md"
                  href={URL.createObjectURL(
                    new Blob([outputMidi.toArray()], { type: "audio/midi" })
                  )}
                  download={`Polyrhythmic Counterpoint - ${inputMidiName} [${new Date(
                    Date.now()
                  ).toISOString()}].mid`}
                >
                  Download
                </a>
              </div>
              <div>
                <button onClick={() => setInputMidi(null)}>
                  <div>
                    <h4 className="text-lg hover:text-gray-600">Clear</h4>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute flex flex-row right-0 items-start justify-end h-full drop-shadow-md">
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
        <HelpPanel open={openMenu === Menu.HELP} />
        <div
          className={`flex flex-col justify-start gap-4 bg-gray-100 p-4 h-full`}
        >
          <PanelIconButton
            panelOpen={openMenu === Menu.HELP}
            setPanelOpen={toggleMenu(Menu.HELP)}
            Icon={QuestionMarkCircleIcon}
          />
          <PanelIconButton
            panelOpen={openMenu === Menu.SETTINGS}
            setPanelOpen={toggleMenu(Menu.SETTINGS)}
            Icon={AdjustmentsHorizontalIcon}
          />
          {inputMidi && outputMidi && (
            <PanelIconButton
              panelOpen={openMenu === Menu.CODE}
              setPanelOpen={toggleMenu(Menu.CODE)}
              Icon={CodeBracketIcon}
            />
          )}
        </div>
      </div>
    </div>
  );
}
