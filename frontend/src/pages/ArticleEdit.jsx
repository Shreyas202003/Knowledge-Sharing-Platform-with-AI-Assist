import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from '../components/editor/RichTextEditor';
import api from '../services/api';
import { Save, Send, Image as ImageIcon, Tag as TagIcon, ArrowLeft } from 'lucide-react';
import AiWritingAssistant from '../components/editor/AiWritingAssistant';

const ArticleEdit = () => {
    const { slug } = useParams();
    const [id, setId] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await api.get(`/articles/public/${slug}`);
                const article = res.data.data;
                setId(article.id);
                setTitle(article.title);
                setContent(article.contentHtml);
                setCategory(article.category || 'Tech');
                setTags(article.tags || '');
                setCoverImage(article.coverImage || '');
            } catch (err) {
                console.error(err);
                alert('Failed to load article for editing');
                navigate('/');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchArticle();
    }, [slug, navigate]);

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
            await api.put(`/articles/${id}`, {
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
            alert('Failed to update article');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-accent-primary transition-colors mb-6 text-sm font-bold"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold">Edit Technical <span className="text-accent-primary">Insight</span></h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSubmit('DRAFT')}
                        disabled={loading}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Save size={18} />
                        Update Draft
                    </button>
                    <button
                        onClick={() => handleSubmit('PUBLISHED')}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Send size={18} />
                        Update & Publish
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

export default ArticleEdit;
