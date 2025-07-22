'use client'

import { FaDownload, FaWindows, FaApple, FaLinux, FaAndroid, FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

export default function HowToInstall() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaDownload className="text-3xl text-red-500 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            How to Install
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Complete installation guide for all platforms. Follow these step-by-step instructions to safely install your apps.
                    </p>
                </div>

                {/* Warning Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-12">
                    <div className="flex items-start">
                        <FaExclamationTriangle className="text-yellow-500 text-xl mr-3 mt-1" />
                        <div>
                            <h3 className="text-yellow-500 font-semibold mb-2">Important Safety Notice</h3>
                            <p className="text-gray-300">
                                Always scan downloaded files with antivirus software before installation. 
                                Disable your antivirus temporarily only if needed during installation, and re-enable it immediately after.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Platform Guides */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Windows Installation */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <FaWindows className="text-2xl text-blue-500 mr-3" />
                            <h2 className="text-2xl font-bold text-white">Windows Installation</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Download the File</h4>
                                    <p className="text-gray-400 text-sm">Click the Windows download link and save the file to your computer.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Disable Antivirus (Temporarily)</h4>
                                    <p className="text-gray-400 text-sm">Some antivirus software may flag cracked apps. Disable real-time protection temporarily.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Extract Archive</h4>
                                    <p className="text-gray-400 text-sm">If it&apos;s a ZIP/RAR file, extract it using WinRAR or 7-Zip. Use the provided password if required.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Run as Administrator</h4>
                                    <p className="text-gray-400 text-sm">Right-click the installer and select &quot;Run as administrator&quot; for proper installation.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Follow Instructions</h4>
                                    <p className="text-gray-400 text-sm">Follow any specific instructions provided with the download (readme.txt, install notes).</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</div>
                                <div>
                                    <h4 className="text-green-400 font-medium mb-1">Re-enable Antivirus</h4>
                                    <p className="text-gray-400 text-sm">Once installation is complete, re-enable your antivirus protection immediately.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* macOS Installation */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <FaApple className="text-2xl text-gray-300 mr-3" />
                            <h2 className="text-2xl font-bold text-white">macOS Installation</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Download DMG File</h4>
                                    <p className="text-gray-400 text-sm">Download the .dmg file for macOS applications.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Allow Unknown Developers</h4>
                                    <p className="text-gray-400 text-sm">Go to System Preferences → Security & Privacy → Allow apps downloaded from &quot;Anywhere&quot;.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Mount DMG</h4>
                                    <p className="text-gray-400 text-sm">Double-click the .dmg file to mount it and open the installer.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Drag to Applications</h4>
                                    <p className="text-gray-400 text-sm">Drag the app icon to the Applications folder to install.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Apply Crack/Patch</h4>
                                    <p className="text-gray-400 text-sm">If included, run the crack or copy patch files to the application directory.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</div>
                                <div>
                                    <h4 className="text-green-400 font-medium mb-1">Launch Application</h4>
                                    <p className="text-gray-400 text-sm">Launch the app from Applications folder or Launchpad.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Android Installation */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <FaAndroid className="text-2xl text-green-500 mr-3" />
                            <h2 className="text-2xl font-bold text-white">Android Installation</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Enable Unknown Sources</h4>
                                    <p className="text-gray-400 text-sm">Go to Settings → Security → Unknown Sources and enable it.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Download APK</h4>
                                    <p className="text-gray-400 text-sm">Download the .apk file directly to your Android device.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Install APK</h4>
                                    <p className="text-gray-400 text-sm">Tap the downloaded .apk file and follow installation prompts.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</div>
                                <div>
                                    <h4 className="text-green-400 font-medium mb-1">Launch App</h4>
                                    <p className="text-gray-400 text-sm">Find the app in your app drawer and launch it.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Linux Installation */}
                    <div className="card p-6">
                        <div className="flex items-center mb-6">
                            <FaLinux className="text-2xl text-yellow-500 mr-3" />
                            <h2 className="text-2xl font-bold text-white">Linux Installation</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Download Package</h4>
                                    <p className="text-gray-400 text-sm">Download .deb, .rpm, or .tar.gz file depending on your distribution.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Make Executable</h4>
                                    <p className="text-gray-400 text-sm">Use chmod +x filename to make files executable if needed.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Install Package</h4>
                                    <p className="text-gray-400 text-sm">Use dpkg -i (Debian/Ubuntu) or rpm -i (Red Hat/Fedora) to install.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</div>
                                <div>
                                    <h4 className="text-green-400 font-medium mb-1">Run Application</h4>
                                    <p className="text-gray-400 text-sm">Launch from applications menu or run from terminal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Common Issues */}
                <div className="card p-6 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <FaShieldAlt className="text-red-500 mr-3" />
                        Common Issues & Solutions
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-white font-semibold mb-3">Antivirus Blocking Download</h3>
                            <p className="text-gray-400 text-sm mb-2">
                                This is normal for cracked software. Temporarily disable real-time protection, 
                                download the file, then re-enable protection.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-3">App Won&apos;t Start</h3>
                            <p className="text-gray-400 text-sm mb-2">
                                Run as administrator (Windows) or check if all dependencies are installed. 
                                Some apps require Visual C++ Redistributables.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-3">Password Protected Archive</h3>
                            <p className="text-gray-400 text-sm mb-2">
                                Check the download page for the password. It&apos;s usually provided in the description 
                                or readme file.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-3">Crack Not Working</h3>
                            <p className="text-gray-400 text-sm mb-2">
                                Make sure to follow crack instructions exactly. Some require replacing files, 
                                others need to be run after installation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Tips */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                    <div className="flex items-start">
                        <FaCheckCircle className="text-green-500 text-xl mr-3 mt-1" />
                        <div>
                            <h3 className="text-green-500 font-semibold mb-2">Pro Tips</h3>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                <li>• Always create a system restore point before installing cracked software</li>
                                <li>• Use a virtual machine for testing suspicious files</li>
                                <li>• Keep your antivirus updated and scan files before installation</li>
                                <li>• Read installation instructions carefully - each app may have specific requirements</li>
                                <li>• Backup important data before installing new software</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 