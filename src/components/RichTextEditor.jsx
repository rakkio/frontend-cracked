'use client'

import { useState } from 'react'
import CodeEditor from '@uiw/react-textarea-code-editor'

export default function RichTextEditor({ value, onChange, placeholder = "Enter description...", rows = 6 }) {
    const [mode, setMode] = useState('text') // 'text' or 'markdown'

    const handleEditorChange = (val) => {
        onChange(val)
    }

    const insertFormat = (format) => {
        const textarea = document.querySelector('.w-tc-editor textarea')
        if (!textarea) return

        const currentValue = value || ''
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = currentValue.substring(start, end)
        let newText = ''

        switch (format) {
            case 'bold':
                newText = `**${selectedText || 'bold text'}**`
                break
            case 'italic':
                newText = `*${selectedText || 'italic text'}*`
                break
            case 'underline':
                newText = `__${selectedText || 'underlined text'}__`
                break
            case 'code':
                newText = `\`${selectedText || 'code'}\``
                break
            case 'link':
                newText = `[${selectedText || 'link text'}](https://example.com)`
                break
            case 'list':
                newText = `\n- ${selectedText || 'list item'}`
                break
            case 'numbered':
                newText = `\n1. ${selectedText || 'numbered item'}`
                break
            case 'heading':
                newText = `\n## ${selectedText || 'Heading'}\n`
                break
            case 'quote':
                newText = `\n> ${selectedText || 'quote text'}\n`
                break
            default:
                return
        }

        const newValue = currentValue.substring(0, start) + newText + currentValue.substring(end)
        onChange(newValue)
    }

    return (
        <div className="rich-text-editor">
            {/* Mode Toggle */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setMode('text')}
                        className={`px-3 py-1 text-xs rounded ${
                            mode === 'text' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Plain Text
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('markdown')}
                        className={`px-3 py-1 text-xs rounded ${
                            mode === 'markdown' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Markdown
                    </button>
                </div>
                <span className="text-xs text-gray-400">
                    {value?.length || 0} characters
                </span>
            </div>

            {/* Formatting Toolbar */}
            {mode === 'markdown' && (
                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                    <button
                        type="button"
                        onClick={() => insertFormat('bold')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Bold"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('italic')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Italic"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('underline')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Underline"
                    >
                        <u>U</u>
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('code')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded font-mono"
                        title="Code"
                    >
                        {'</>'}
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('link')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Link"
                    >
                        🔗
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('list')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Bullet List"
                    >
                        •
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('numbered')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Numbered List"
                    >
                        1.
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('heading')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Heading"
                    >
                        H
                    </button>
                    <button
                        type="button"
                        onClick={() => insertFormat('quote')}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                        title="Quote"
                    >
                        "
                    </button>
                </div>
            )}

            {/* Editor */}
            <div className="border border-gray-600 rounded-lg overflow-hidden">
                {mode === 'markdown' ? (
                    <CodeEditor
                        value={value || ''}
                        language="markdown"
                        placeholder={placeholder}
                        onChange={handleEditorChange}
                        padding={15}
                        style={{
                            fontSize: 14,
                            backgroundColor: 'rgb(55 65 81 / 0.5)',
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                            color: '#fff',
                            minHeight: `${rows * 24}px`
                        }}
                    />
                ) : (
                    <textarea
                        value={value || ''}
                        onChange={(e) => handleEditorChange(e.target.value)}
                        placeholder={placeholder}
                        rows={rows}
                        className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none resize-none"
                        style={{ minHeight: `${rows * 24}px` }}
                    />
                )}
            </div>

            {/* Preview for Markdown */}
            {mode === 'markdown' && value && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Preview:</h4>
                    <div 
                        className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-300 prose prose-invert max-w-none"
                        style={{ fontSize: '14px' }}
                    >
                        <div dangerouslySetInnerHTML={{ 
                            __html: (value || '')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/__(.*?)__/g, '<u>$1</u>')
                                .replace(/`(.*?)`/g, '<code style="background-color: rgb(75 85 99); padding: 2px 4px; border-radius: 3px;">$1</code>')
                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #ef4444;">$1</a>')
                                .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.25em; font-weight: bold; margin: 0.5em 0;">$1</h2>')
                                .replace(/^- (.*$)/gm, '<li style="margin-left: 1em;">$1</li>')
                                .replace(/^\d+\. (.*$)/gm, '<li style="margin-left: 1em; list-style-type: decimal;">$1</li>')
                                .replace(/^> (.*$)/gm, '<blockquote style="border-left: 3px solid #ef4444; padding-left: 1em; margin: 0.5em 0; color: #d1d5db;">$1</blockquote>')
                                .replace(/\n/g, '<br>')
                        }} />
                    </div>
                </div>
            )}
        </div>
    )
} 