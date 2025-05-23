import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    EyeOff,
    Bold,
    Italic,
    List,
    ListOrdered,
    Link,
    Code,
    Quote,
    Type,
    Maximize2,
    Minimize2
} from 'lucide-react';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    fullPage?: boolean;
}

const TextEditor = ({ value, onChange, placeholder, error, fullPage = false }: TextEditorProps) => {
    const [preview, setPreview] = useState(false);
    const [sideBySide, setSideBySide] = useState(false);
    const [focused, setFocused] = useState(false);
    const [contentTextarea, setContentTextarea] = useState<HTMLTextAreaElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            setContentTextarea(textareaRef.current);
        }
    }, []);

    const insertFormatting = (format: string) => {
        if (!contentTextarea) return;

        const start = contentTextarea.selectionStart;
        const end = contentTextarea.selectionEnd;
        const selectedText = contentTextarea.value.substring(start, end);
        const currentContent = value || '';

        let newText = '';
        let newCursorPos = start;

        switch (format) {
            case 'bold':
                newText = `**${selectedText || 'bold text'}**`;
                newCursorPos = start + (selectedText ? newText.length : 2);
                break;
            case 'italic':
                newText = `*${selectedText || 'italic text'}*`;
                newCursorPos = start + (selectedText ? newText.length : 1);
                break;
            case 'link':
                newText = `[${selectedText || 'link text'}](url)`;
                newCursorPos = start + newText.length - 4;
                break;
            case 'list':
                newText = `\n- ${selectedText || 'list item'}`;
                newCursorPos = start + newText.length;
                break;
            case 'orderedList':
                newText = `\n1. ${selectedText || 'list item'}`;
                newCursorPos = start + newText.length;
                break;
            case 'quote':
                newText = `\n> ${selectedText || 'quote'}`;
                newCursorPos = start + newText.length;
                break;
            case 'code':
                newText = `\`${selectedText || 'code'}\``;
                newCursorPos = start + (selectedText ? newText.length : 1);
                break;
            default:
                return;
        }

        const newContent = currentContent.substring(0, start) + newText + currentContent.substring(end);
        onChange(newContent);

        setTimeout(() => {
            if (contentTextarea) {
                contentTextarea.focus();
                contentTextarea.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const markdownToHtml = (text: string): string => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#4a5b91]">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="text-[#938384]">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-[#f4e1c3] text-[#4a5b91] px-2 py-1 rounded text-sm font-mono">$1</code>')
            .replace(/^\> (.+)/gm, '<blockquote class="border-l-4 border-[#e7b9ac] pl-4 italic text-[#938384] my-4 bg-[#f6f8fd] py-2 rounded-r">$1</blockquote>')
            .replace(/^\- (.+)/gm, '<li class="ml-4 text-[#4a5b91]">$1</li>')
            .replace(/^(\d+)\. (.+)/gm, '<li class="ml-4 text-[#4a5b91]">$2</li>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#4a5b91] underline hover:text-[#3a4a7a] transition-colors">$1</a>')
            .replace(/\n/g, '<br>')
            .replace(/(<li>.*<\/li>)/g, '<ul class="list-disc list-inside my-4 space-y-1">$1</ul>')
            .replace(/<\/ul>\s*<ul class="list-disc list-inside my-4 space-y-1">/g, '');
    };

    const defaultPlaceholder = `Start writing your story...

You can use markdown formatting:
**bold text** or *italic text*
[link text](url)
- bullet lists
1. numbered lists
> quotes
\`inline code\`

Focus on your content - let your ideas flow freely.`;

    const editorHeight = fullPage ? 'min-h-[75vh]' : 'min-h-96';

    return (
        <motion.div
            className="bg-white border-2 border-[#c9d5ef]/30 rounded-2xl overflow-hidden shadow-sm"
            animate={{
                borderColor: focused ? '#4a5b91' : 'rgba(201, 213, 239, 0.3)',
                boxShadow: focused
                    ? '0 0 0 3px rgba(74, 91, 145, 0.1)'
                    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 0.2 }}
        >
            {/* Header */}
            <motion.div
                className="flex items-center justify-between p-4 bg-[#f6f8fd]/50 border-b border-[#c9d5ef]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center space-x-2">
                    <Type className="w-4 h-4 text-[#938384]" />
                    <span className="text-sm font-medium text-[#4a5b91]">Content Editor</span>
                </div>

                <div className="flex items-center space-x-2">
                    {fullPage && (
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSideBySide(!sideBySide)}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                                sideBySide
                                    ? 'bg-[#4a5b91] text-white'
                                    : 'bg-white border border-[#c9d5ef] text-[#4a5b91] hover:bg-[#f6f8fd]'
                            }`}
                        >
                            {sideBySide ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            <span>Split View</span>
                        </motion.button>
                    )}

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPreview(!preview)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                            preview
                                ? 'bg-[#4a5b91] text-white'
                                : 'bg-white border border-[#c9d5ef] text-[#4a5b91] hover:bg-[#f6f8fd]'
                        }`}
                    >
                        {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span>{preview ? 'Edit' : 'Preview'}</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Formatting Toolbar */}
            <AnimatePresence>
                {!preview && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-wrap gap-1 p-3 bg-white border-b border-[#c9d5ef]/30"
                    >
                        {[
                            { icon: Bold, action: 'bold', title: 'Bold (**text**)' },
                            { icon: Italic, action: 'italic', title: 'Italic (*text*)' },
                            { icon: Link, action: 'link', title: 'Link ([text](url))' },
                            { icon: List, action: 'list', title: 'Bullet List (- item)' },
                            { icon: ListOrdered, action: 'orderedList', title: 'Numbered List (1. item)' },
                            { icon: Quote, action: 'quote', title: 'Quote (> text)' },
                            { icon: Code, action: 'code', title: 'Inline Code (`code`)' }
                        ].map(({ icon: Icon, action, title }, index) => (
                            <motion.button
                                key={action}
                                type="button"
                                onClick={() => insertFormatting(action)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor: '#f6f8fd'
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-[#4a5b91] hover:bg-[#f6f8fd] rounded-lg transition-colors cursor-pointer"
                                title={title}
                            >
                                <Icon className="w-4 h-4" />
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editor Content */}
            <div className="relative">
                {sideBySide && fullPage ? (
                    /* Side by Side View */
                    <div className="flex">
                        <div className="w-1/2 border-r border-[#c9d5ef]/30">
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                placeholder={placeholder || defaultPlaceholder}
                                className={`w-full ${editorHeight} p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-[#4a5b91] placeholder-[#938384]/60 cursor-text`}
                            />
                        </div>
                        <div className="w-1/2 bg-[#f6f8fd]/20">
                            <div
                                className={`${editorHeight} p-6 prose prose-lg max-w-none overflow-auto`}
                                dangerouslySetInnerHTML={{
                                    __html: value
                                        ? markdownToHtml(value)
                                        : '<p class="text-[#938384]/60 italic">Preview will appear here as you type...</p>'
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    /* Single View */
                    <AnimatePresence mode="wait">
                        {!preview ? (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    placeholder={placeholder || defaultPlaceholder}
                                    className={`w-full ${editorHeight} p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-[#4a5b91] placeholder-[#938384]/60 cursor-text`}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`${editorHeight} p-6 prose prose-lg max-w-none overflow-auto bg-[#f6f8fd]/20`}
                                dangerouslySetInnerHTML={{
                                    __html: value
                                        ? markdownToHtml(value)
                                        : '<p class="text-[#938384]/60 italic">No content yet...</p>'
                                }}
                            />
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Status Bar */}
            <AnimatePresence>
                {(value || error) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 py-3 bg-[#f6f8fd]/30 border-t border-[#c9d5ef]/30"
                    >
                        {error ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-500 flex items-center space-x-2"
                            >
                                <span className="flex-shrink-0">⚠️</span>
                                <span>{error}</span>
                            </motion.p>
                        ) : (
                            <div className="flex justify-between items-center text-xs text-[#938384]">
                                <span>{value.length} characters</span>
                                <span>{value.split(/\s+/).filter(word => word.length > 0).length} words</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TextEditor;