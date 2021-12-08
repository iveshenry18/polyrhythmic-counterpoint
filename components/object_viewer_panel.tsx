import { Midi } from "@tonejs/midi"
import SidePanel from "./side_panel"

export function ObjectViewer({ title, content }: { title: string, content: Object }) {
  return (
    content
      ?
      <div className="max-w-md flex flex-col justify-around gap-3 overflow-y-hidden relative">
        <h2 className="text-lg">{title}</h2>
        <pre className="max-h-60 overflow-y-scroll relative">
          <code>
            {JSON.stringify(content, null, 2)}
          </code>
        </pre>
      </div>
      : null
  )
}

export default function ObjectPanel({
  inputMidi,
  outputMidi,
  open=false
}: {
  inputMidi: Midi,
  outputMidi: Midi,
  open: boolean,
}) {
  return (
    <SidePanel open={open}>
      <ObjectViewer
        title="Input"
        content={inputMidi}
      />
      <ObjectViewer
        title="Output"
        content={outputMidi}
      />
    </SidePanel>
  )
}