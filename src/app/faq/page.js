'use client'

import { useState } from 'react'
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState(null)

    const faqs = [
        {
            question: "Is this website safe to use?",
            answer: "We prioritize user safety by scanning all uploads and providing detailed installation guides. However, always use antivirus software and follow our safety guidelines when downloading any software."
        },
        {
            question: "Why do antivirus programs flag these downloads?",
            answer: "Cracked software often triggers antivirus warnings because the cracks modify original files. This is normal behavior. Always scan files and temporarily disable antivirus only during installation if needed."
        },
        {
            question: "How do I know if a download is legitimate?",
            answer: "Check user reviews, ratings, and comments. Look for detailed installation instructions and verify file sizes. Avoid downloads with multiple redirects or suspicious behavior."
        },
        {
            question: "What should I do if I can't find a password for an archive?",
            answer: "The password is usually provided on the download page, in the description, or in a readme file. Common passwords include the website URL or are mentioned in the comments section."
        },
        {
            question: "Why won't the cracked software work after installation?",
            answer: "Ensure you followed all installation steps correctly, run as administrator, disable antivirus during installation, and check if you need additional dependencies like Visual C++ Redistributables."
        },
        {
            question: "How often is new software added?",
            answer: "We add new applications daily. Check our 'New Releases' section for the latest additions, or follow us for updates on newly cracked software."
        },
        {
            question: "Can I request specific software?",
            answer: "While we don't take direct requests, you can suggest software in the comments. Popular requests are more likely to be added to our collection."
        },
        {
            question: "Is it legal to download cracked software?",
            answer: "Downloading cracked software may violate copyright laws in your jurisdiction. This site is for educational purposes. Users are responsible for complying with local laws."
        },
        {
            question: "What platforms are supported?",
            answer: "We provide software for Windows, macOS, Linux, Android, and iOS. Each download page clearly indicates which platforms are supported."
        },
        {
            question: "How do I report a broken download link?",
            answer: "Use the contact form or comment on the specific app page. We regularly check and update broken links to ensure all downloads work properly."
        },
        {
            question: "Can I use these apps for commercial purposes?",
            answer: "Cracked software should not be used for commercial purposes as it violates licensing agreements. Consider purchasing legitimate licenses for business use."
        },
        {
            question: "Why do some downloads require surveys or verification?",
            answer: "Legitimate downloads from our site never require surveys. If you encounter this, you may be on a fake mirror site. Always use our official domain."
        }
    ]

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaQuestionCircle className="text-3xl text-red-500 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Frequently Asked Questions
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Get answers to the most common questions about downloading, installing, and using cracked software safely.
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="card overflow-hidden">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                            >
                                <h3 className="text-white font-semibold text-lg pr-4">
                                    {faq.question}
                                </h3>
                                {openFaq === index ? (
                                    <FaChevronUp className="text-red-500 flex-shrink-0" />
                                ) : (
                                    <FaChevronDown className="text-gray-400 flex-shrink-0" />
                                )}
                            </button>
                            
                            {openFaq === index && (
                                <div className="px-6 pb-6">
                                    <div className="border-t border-gray-700 pt-4">
                                        <p className="text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Still have questions */}
                <div className="text-center mt-12">
                    <div className="card p-8 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
                        <p className="text-gray-400 mb-6">
                            If you couldn't find the answer you're looking for, feel free to contact us directly.
                        </p>
                        <a
                            href="/contact"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
} 