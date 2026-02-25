import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editorConfiguration = {
    toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
    ],
    placeholder: 'Start writing your technical masterpiece...',
    licenseKey: 'GPL'
};

const RichTextEditor = ({ value, onChange }) => {
    const [isReady, setIsReady] = React.useState(false);
    const [useFallback, setUseFallback] = React.useState(false);

    // Auto-fallback timer: if CKEditor doesn't load in 5s, offer manual switch or auto-show
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!isReady) {
                console.warn('CKEditor initialization timed out. Readying fallback.');
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [isReady]);

    if (useFallback) {
        return (
            <div className="rich-text-editor prose-invert">
                <textarea
                    autoFocus
                    placeholder="Technical editor fallback active. Write your masterpiece here..."
                    className="w-full min-h-[450px] bg-primary border border-tertiary rounded-xl p-8 font-serif text-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent-primary/30"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <div className="mt-2 flex justify-between items-center text-[10px] text-slate-500 px-2">
                    <span>Markdown & HTML supported • Fallback Mode</span>
                    <button
                        onClick={() => setUseFallback(false)}
                        className="hover:text-accent-primary transition-colors underline"
                    >
                        Try Re-initializing Rich Editor
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rich-text-editor prose-invert relative min-h-[400px]">
            {!isReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 backdrop-blur-md z-10 rounded-xl border border-tertiary">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mb-4"></div>
                    <p className="text-sm font-serif italic text-accent-primary">Igniting QuantumQuill Workspace...</p>
                    <button
                        onClick={() => setUseFallback(true)}
                        className="mt-6 text-xs text-secondary-foreground hover:text-accent-primary underline transition-colors"
                    >
                        Editor taking too long? Use standard text mode
                    </button>
                </div>
            )}

            <CKEditor
                editor={ClassicEditor}
                data={value}
                config={editorConfiguration}
                onReady={() => {
                    console.log('CKEditor is ready');
                    setIsReady(true);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                onError={(error) => {
                    console.error('CKEditor error:', error);
                    setUseFallback(true);
                }}
            />

            <style>{`
                .ck-editor__editable_inline {
                    min-height: 450px !important;
                    background-color: #0F172A !important;
                    color: #F8FAFC !important;
                    border-color: transparent !important;
                    padding: 40px !important;
                    font-family: 'Merriweather', serif !important;
                    font-size: 1.125rem !important;
                    line-height: 1.8 !important;
                }
                .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
                    border-color: transparent !important;
                }
                .ck.ck-editor__main {
                    border-radius: 0 0 12px 12px !important;
                    overflow: hidden !important;
                    border: 1px solid #334155 !important;
                }
                .ck.ck-toolbar {
                    background-color: #1E293B !important;
                    border-color: #334155 !important;
                    border-radius: 12px 12px 0 0 !important;
                    padding: 8px !important;
                }
                .ck.ck-button {
                    color: #F8FAFC !important;
                    border-radius: 8px !important;
                    margin: 0 2px !important;
                }
                .ck.ck-button:hover {
                    background-color: #334155 !important;
                }
                .ck.ck-button.ck-on {
                    background-color: #F59E0B !important;
                    color: #0F172A !important;
                }
                .ck.ck-list {
                    background-color: #1E293B !important;
                    border: 1px solid #334155 !important;
                }
                .ck.ck-list__item:hover {
                    background-color: #334155 !important;
                }
                .ck-icon {
                    color: #F8FAFC !important;
                }
                .ck.ck-button.ck-on .ck-icon {
                    color: #0F172A !important;
                }
                .ck.ck-toolbar__separator {
                    background-color: #334155 !important;
                }
                .ck.ck-placeholder::before {
                    color: #475569 !important;
                    font-style: italic !important;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
