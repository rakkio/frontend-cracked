import { FaInfoCircle } from 'react-icons/fa'

export default function AppDescription({ app }) {
    if (!app?.description) return null

    return (
        <section className="bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 mb-8 shadow-xl shadow-red-500/10">
            <h2 className="text-2xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-300 bg-clip-text mb-6 flex items-center space-x-3 font-mono">
                <FaInfoCircle className="text-red-400" />
                <span>ABOUT_{app.name.toUpperCase().replace(/\s+/g, '_')}</span>
            </h2>
            <div 
                className="text-gray-300 prose prose-invert prose-lg max-w-none leading-relaxed font-mono text-sm border-l-4 border-red-500/50 pl-6 bg-black/20 p-6 rounded-lg"
                dangerouslySetInnerHTML={{ __html: app.description.replace(/\n/g, '<br>') }}
                itemProp="description"
            />
        </section>
    )
}