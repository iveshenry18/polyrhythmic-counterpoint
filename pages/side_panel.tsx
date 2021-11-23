export default function SidePanel({ children }) {
    return (
        <div className="flex-col justify-start gap-4 bg-gray-50 p-5 h-screen relative">
            {children}
        </div>
    )
}