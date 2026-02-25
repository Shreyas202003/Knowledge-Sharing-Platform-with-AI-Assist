import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/editor/RichTextEditor';
import api from '../services/api';
import { Save, Send, Image as ImageIcon, Tag as TagIcon } from 'lucide-react';
import AiWritingAssistant from '../components/editor/AiWritingAssistant';

const ArticleCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Tech');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleApplyAiSuggestion = (suggestion) => {
        setContent(prev => prev + '<p>' + suggestion + '</p>');
    };

    const handleSubmit = async (status) => {
        if (!title || !content) {
            alert('Please provide a title and content');
            return;
        }

        setLoading(true);
        try {
            await api.post('/articles', {
                title,
                contentHtml: content,
                category,
                tags,
                coverImage,
                status: status
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold">Create New <span className="text-accent-primary">Article</span></h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSubmit('DRAFT')}
                        disabled={loading}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSubmit('PUBLISHED')}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Send size={18} />
                        Publish
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <input
                    type="text"
                    placeholder="Enter a compelling title..."
                    className="w-full bg-transparent text-4xl font-serif font-bold text-primary-foreground focus:outline-none placeholder:opacity-30 border-b border-tertiary pb-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <select
                            className="w-full input-premium pl-10 appearance-none bg-secondary"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Tech">Tech</option>
                            <option value="AI">AI</option>
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Cloud">Cloud</option>
                            <option value="Security">Security</option>
                        </select>
                    </div>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cover image URL..."
                            className="w-full input-premium pl-10"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                        />
                    </div>
                </div>

                <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tags (comma-separated)..."
                        className="w-full input-premium pl-10"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div className="bg-secondary p-1 rounded-xl border border-tertiary">
                    <RichTextEditor value={content} onChange={setContent} />
                </div>

                <AiWritingAssistant
                    content={content}
                    onApplySuggestion={handleApplyAiSuggestion}
                />
            </div>
        </div>
    );
};

export default ArticleCreate;
