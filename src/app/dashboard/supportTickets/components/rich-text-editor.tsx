"use client"

import { useRef } from "react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Type here" }: RichTextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleFormatText = (command: string, value = "") => {
        if (!textareaRef.current) return

        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = textarea.value.substring(start, end)

        let formattedText = ""

        switch (command) {
            case "bold":
                formattedText = `**${selectedText}**`
                break
            case "italic":
                formattedText = `*${selectedText}*`
                break
            case "underline":
                formattedText = `_${selectedText}_`
                break
            case "link":
                formattedText = `[${selectedText}](url)`
                break
            case "list-ul":
                formattedText = selectedText
                    .split("\n")
                    .map((line) => `• ${line}`)
                    .join("\n")
                break
            case "list-ol":
                formattedText = selectedText
                    .split("\n")
                    .map((line, i) => `${i + 1}. ${line}`)
                    .join("\n")
                break
            case "code":
                formattedText = `\`${selectedText}\``
                break
            case "quote":
                formattedText = `> ${selectedText}`
                break
            default:
                formattedText = selectedText
        }

        const newText = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
        onChange(newText)

        // Set cursor position after the inserted text
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
        }, 0)
    }

    return (
        <div className="border rounded-md">
            <div className="flex flex-wrap items-center p-2 border-b">
                <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleFormatText("undo")} title="Undo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 10L4 15L9 20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M15 10L20 15L15 20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <button
                    className="p-1 hover:bg-gray-100 rounded ml-1"
                    onClick={() => handleFormatText("paragraph")}
                    title="Paragraph"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7L5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M19 17L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <div className="border-r h-6 mx-2"></div>
                <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleFormatText("heading")} title="Heading">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded ml-1" onClick={() => handleFormatText("quote")} title="Quote">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
                <div className="border-r h-6 mx-2"></div>
                <button
                    className="p-1 hover:bg-gray-100 rounded font-bold"
                    onClick={() => handleFormatText("bold")}
                    title="Bold"
                >
                    B
                </button>
                <button
                    className="p-1 hover:bg-gray-100 rounded italic ml-1"
                    onClick={() => handleFormatText("italic")}
                    title="Italic"
                >
                    I
                </button>
                <button
                    className="p-1 hover:bg-gray-100 rounded underline ml-1"
                    onClick={() => handleFormatText("underline")}
                    title="Underline"
                >
                    U
                </button>
                <button className="p-1 hover:bg-gray-100 rounded ml-1" onClick={() => handleFormatText("link")} title="Link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4H4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 20H20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                            d="M14 4L20 4V10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10 20L4 20L4 14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <div className="border-r h-6 mx-2"></div>
                <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => handleFormatText("list-ul")}
                    title="Bullet List"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    className="p-1 hover:bg-gray-100 rounded ml-1"
                    onClick={() => handleFormatText("list-ol")}
                    title="Numbered List"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="border-r h-6 mx-2"></div>
                <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleFormatText("code")} title="Code">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded ml-1" onClick={() => handleFormatText("table")} title="Table">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 15L15 20L20 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M4 4H11M4 8H11M4 12H11M15 4V20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded ml-1" onClick={() => handleFormatText("image")} title="Image">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 8V21H3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                            d="M23 3H1V8H23V3Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded ml-1" onClick={() => handleFormatText("link")} title="Link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <textarea
                ref={textareaRef}
                className="w-full p-4 h-40 focus:outline-none resize-none"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            ></textarea>
        </div>
    )
}

