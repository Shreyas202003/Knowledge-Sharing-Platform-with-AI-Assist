import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import DOMPurify from 'dompurify';
import AiSummary from '../components/article/AiSummary';
import { Loader2, Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';

const ArticleDetail = () => {
    const { slug } = useParams();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const { data: article, isLoading, isError } = useQuery({
        queryKey: ['article', slug],
        queryFn: async () => {
            const res = await api.get(`/articles/public/${slug}`);
            return res.data.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-accent-primary">
                <Loader2 className="animate-spin w-12 h-12 mb-4" />
                <span className="font-serif italic text-lg">Unfolding knowledge...</span>
            </div>
        );
    }

    if (isError || !article) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                <h2 className="text-3xl font-serif font-bold mb-4">Article Not Found</h2>
                <p className="text-secondary-foreground mb-8">The knowledge you're looking for might have been moved or deleted.</p>
                <Link to="/" className="btn-primary inline-flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Library
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent-primary transition-colors mb-8 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to insights
            </Link>

            <header className="mb-12">
                <div className="flex flex-wrap gap-3 mb-6">
                    {article.tags && (typeof article.tags === 'string' ? article.tags.split(',') : article.tags).map(tag => {
                        const trimmedTag = typeof tag === 'string' ? tag.trim() : tag;
                        return trimmedTag ? (
                            <span key={trimmedTag} className="text-xs font-bold tracking-widest uppercase text-accent-primary bg-accent-primary/5 px-3 py-1 rounded border border-accent-primary/20">
                                {trimmedTag}
                            </span>
                        ) : null;
                    })}
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                    {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-secondary-foreground border-y border-tertiary py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold">
                            {article.authorName[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-primary-foreground font-bold">{article.authorName}</p>
                            <p className="text-xs">Technical Author</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>5 min read</span>
                        </div>
                    </div>
                </div>
            </header>

            {article.coverImage && (
                <div className="mb-12 rounded-2xl overflow-hidden border border-tertiary shadow-2xl">
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full aspect-video object-cover"
                    />
                </div>
            )}

            {/* AI Summary Integration */}
            <AiSummary content={article.contentHtml} />

            <article
                className="article-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.contentHtml) }}
            />

            <footer className="mt-20 pt-12 border-t border-tertiary">
                <div className="card-premium text-center">
                    <h3 className="text-2xl font-serif mb-4">Did you find this helpful?</h3>
                    <div className="flex justify-center gap-4">
                        <button className="btn-secondary">Bookmark</button>
                        <button className="btn-primary">Share Perspective</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ArticleDetail;
