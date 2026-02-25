import React, { useState } from 'react';
import api from '../../services/api';
import { Sparkles, Loader2, Wand2, ListChecks, Tags } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AiWritingAssistant = ({ content, onApplySuggestion }) => {
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    const handleAssist = async (type) => {
        setLoading(true);
        try {
            const res = await api.post('/ai/assist', { content, type });
            setSuggestion(res.data.data);
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || "Failed to get AI assistance. Please check your backend configuration and Gemini API key.";
            setSuggestion(`Error calling AI service: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-panel mt-8">
            <div className="flex items-center gap-2 mb-4 text-accent-tertiary">
                <Sparkles size={20} />
                <h3 className="font-serif font-bold text-lg">AI Writing Assistant</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => handleAssist('EXPAND')}
                    disabled={loading || !content}
                    className="btn-secondary text-xs py-1.5 px-3 border-accent-tertiary text-accent-tertiary hover:bg-accent-tertiary/10 flex items-center gap-2"
                >
                    <ListChecks size={14} />
                    Expand Bullets
                </button>
                <button
                    onClick={() => handleAssist('SUGGEST_TAGS')}
                    disabled={loading || !content}
                    className="btn-secondary text-xs py-1.5 px-3 border-accent-tertiary text-accent-tertiary hover:bg-accent-tertiary/10 flex items-center gap-2"
                >
                    <Tags size={14} />
                    Suggest Tags
                </button>
                <button
                    onClick={() => handleAssist('IMPROVE')}
                    disabled={loading || !content}
                    className="btn-secondary text-xs py-1.5 px-3 border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-2"
                >
                    <Sparkles size={14} />
                    Improve Grammar/Clarity
                </button>
                <button
                    onClick={() => handleAssist('SUGGEST_TITLE')}
                    disabled={loading || !content}
                    className="btn-secondary text-xs py-1.5 px-3 border-amber-500 text-amber-500 hover:bg-amber-500/10 flex items-center gap-2"
                >
                    <Wand2 size={14} />
                    Suggest Better Title
                </button>
            </div>

            {
                loading ? (
                    <div className="flex items-center justify-center py-8 text-accent-tertiary animate-pulse">
                        <Loader2 className="animate-spin mr-2" />
                        <span>Consulting AI...</span>
                    </div>
                ) : suggestion && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-primary/50 border-l-2 border-accent-tertiary p-4 rounded-r-lg text-sm leading-relaxed text-secondary-foreground">
                            {suggestion}
                        </div>
                        <button
                            onClick={() => {
                                onApplySuggestion(suggestion);
                                setSuggestion('');
                            }}
                            className="text-xs text-accent-tertiary hover:underline flex items-center gap-1"
                        >
                            <Wand2 size={12} />
                            Apply to content
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default AiWritingAssistant;
