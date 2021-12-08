export default function SidePanel({ children, open=false }) {
    return ( open &&
        <div
            className={`flex-col justify-start gap-6 bg-gray-50 p-5 h-screen transition-all min-w-min w-1/4`}>
            {children}
        </div>
    )
}

export function IconButton ({ Icon, onClick, className="", active=false }) {
    return (
        <button
            className={`${className} z-10`}
            onClick={onClick}>
              <Icon className={`h-8 w-8 ${active ? "black" : "text-gray-400 hover:text-gray-500"}`} />
            </button>

    )
}

export function PanelIconButton({ panelOpen, setPanelOpen, Icon, className="" }) {
    return (
        <IconButton
          className={`${className} z-10`}
          onClick={() => (setPanelOpen((prevPanelOpen) => (!prevPanelOpen)))} 
          active={panelOpen}
          Icon={Icon}
          />
    )
}
