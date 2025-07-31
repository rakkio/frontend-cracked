export default function BackgroundPattern() {
    return (
        <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-green-500 to-blue-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
    )
} 