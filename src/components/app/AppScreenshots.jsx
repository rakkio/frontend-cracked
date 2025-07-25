import Image from 'next/image'
import { FaImages } from 'react-icons/fa'

export default function AppScreenshots({ app }) {
    if (!app?.screenshots || app.screenshots.length === 0) return null

    return (
        <section className="bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 mb-8 shadow-xl shadow-red-500/10">
            <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-6 flex items-center space-x-3 font-mono">
                <FaImages className="text-red-400" />
                <span>SCREENSHOTS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {app.screenshots.map((screenshot, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl border border-red-500/30 hover:border-red-400/60 transition-all duration-300 bg-black/20">
                        <Image
                            src={screenshot}
                            alt={`${app.name} screenshot ${index + 1}`}
                            width={500}
                            height={350}
                            className="rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500 border border-red-500/20"
                            loading={index < 2 ? "eager" : "lazy"}
                            itemProp="screenshot"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-red-600/80 text-white px-3 py-1 rounded-lg text-sm font-mono font-bold">
                                SCREENSHOT_{index + 1}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}