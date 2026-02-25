import React, { useState } from 'react';
import api from '../../services/api';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const AiSummary = ({ content }) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');

    const handleSummarize = async () => {
        setLoading(true);
        try {
            const res = await api.post('/ai/assist', { content, type: 'SUMMARIZE' });
            setSummary(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!content) return null;

    return (
        <div className="card-premium border-accent-tertiary/30 bg-accent-tertiary/5 my-8">
            {!summary ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-accent-tertiary" size={20} />
                        <span className="text-secondary-foreground font-serif italic">Short on time? Let AI summarize this for you.</span>
                    </div>
                    <button
                        onClick={handleSummarize}
                        disabled={loading}
                        className="text-accent-tertiary hover:text-accent-tertiary/80 font-bold flex items-center gap-1 transition-all"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <>Summarize <ArrowRight size={18} /></>}
                    </button>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 text-accent-tertiary text-xs font-bold tracking-widest uppercase">
                        <Sparkles size={14} />
                        AI Summary
                    </div>
                    <p className="text-lg leading-relaxed text-primary-foreground font-serif italic">
                        "{summary}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default AiSummary;
