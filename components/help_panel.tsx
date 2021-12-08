import SidePanel from "./side_panel";

export default function HelpPanel({ open = false }) {
    return (
        <SidePanel
            open={open}
        >
            <div>
                <h3 className="text-xl">What is this?</h3>
                <p>you tell me honestly</p>
            </div>
            <div>
                <h3 className="text-xl">Why are you doing this when you should be composing for your upcoming recital</h3>
                <p>Ever heard of coping with stress via self-sabotage???</p>
            </div>
            <div>
                <h3 className="text-xl">Ok but actually how do I use this</h3>
                <ul>
                    <li><a href="https://youtu.be/g4JNQc2pS7I?t=106" target="_blank">Sibelius</a></li>
                    <li><a href="https://usermanuals.finalemusic.com/Finale2014Mac/Content/Finale/MFTYPDLG.htm?Highlight=export%20midi" target="_blank">Finale</a></li>
                    <li><a href="https://steinberg.help/dorico/v2/en/dorico/topics/project_file_handling/project_file_handling_midi_exporting_t.html" target="_blank">Dorico</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-xl">ok but what if I want to know some boring details about the specifics of this implementation?</h3>
                <p>Ok fine, I have this little nugget for ya: the imported midi is processed to polyrhythmic ratios based on just intonation from the "quarter note pitch" (the lowest tonic by default)</p>
            </div>
        </SidePanel>
    )
}