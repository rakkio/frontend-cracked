export default function InfoFooter() {
    return (
        <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h4 className="text-blue-400 font-semibold mb-3">📋 How This Works</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200">
                    <div className="flex items-start space-x-2">
                        <span className="text-blue-400 font-bold">1.</span>
                        <span>Advertisement loads and displays content from our partners</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-blue-400 font-bold">2.</span>
                        <span>Wait for countdown or skip after 5 seconds (when available)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-blue-400 font-bold">3.</span>
                        <span>Your download starts automatically when ready</span>
                    </div>
                </div>
                <div className="mt-4 text-xs text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
                    💡 <strong>Note:</strong> Different ad types may behave differently. Direct links will redirect you to partner pages, while script-based ads display content here.
                </div>
            </div>
        </div>
    )
} 