import { ReactNode } from "react";

import { pitchClassNames } from "../functions/music_utilities";
import SidePanel from "./side_panel";

export interface ConversionSettings {
  pitchCenter: string,
  rhythmMultiplier: number,
  tempo: number,
  lowestPitch: number,
}

export default function ConversionSettingPanel(
  {
    conversionSettings,
    setConversionSettings,
    open=false
  }: {
    open: boolean,
    conversionSettings: ConversionSettings,
    setConversionSettings: Function
  }) {
  return (
    <SidePanel open={open}>
      <h2 className="text-xl font-serif mb-2">Settings</h2>
      <ConversionSetting title="Pitch Center">
        <select>
          <option value="default">Key from MIDI</option>
          {pitchClassNames.map((pitchClassName) => (
            <option value={pitchClassName} id={pitchClassName} key={pitchClassName}>{pitchClassName}</option>
          ))}
        </select>
      </ConversionSetting>
      <ConversionSetting title="Rhythm Multiplier">
        <input type="number" min={1} max={64} defaultValue={4}></input>
      </ConversionSetting>
      <ConversionSetting title="Tempo">
        <p>Read from MIDI</p>
      </ConversionSetting>
      <ConversionSetting title="Quarter Note Pitch">
        <p>Lowest tonic in file</p>
      </ConversionSetting>
    </SidePanel>
  )
}

function ConversionSetting(
  {
    title,
    children,
  }: {
    title: string,
    children: ReactNode
  }) {
  return (
    <div className="flex flex-row justify-between gap-4">
      <label className="mr-5">{title}</label>
      <div>
        {children}
      </div>
    </div>
  )
}