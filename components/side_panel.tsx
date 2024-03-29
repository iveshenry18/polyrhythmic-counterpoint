export default function SidePanel({ children, open=false }) {
    return ( open &&
        <div
            className={`flex-col justify-start gap-7 bg-gray-100 p-5 transition-all min-w-min w-1/4 max-h-full overflow-y-scroll`}>
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
