import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowUpRight, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ArticleCard = ({ article, onDelete }) => {
    const { user } = useAuth();
    const isAuthor = user?.username === article.authorName;

    return (
        <div className="card-premium h-full flex flex-col group relative">
            {article.coverImage && (
                <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl border-b border-tertiary">
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>

                    {isAuthor && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                                to={`/edit/${article.slug}`}
                                className="p-2 bg-secondary/80 backdrop-blur-md rounded-lg text-accent-primary hover:bg-accent-primary hover:text-primary transition-all border border-accent-primary/20"
                                title="Edit Technical Insight"
                            >
                                <Edit3 size={16} />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (window.confirm('Are you sure you want to delete this architectural insight?')) {
                                        onDelete(article.id);
                                    }
                                }}
                                className="p-2 bg-secondary/80 backdrop-blur-md rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                title="Delete Insight"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Link to={`/article/${article.slug}`} className="block flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-accent-primary/10 text-accent-primary rounded text-[10px] font-bold uppercase tracking-wider border border-accent-primary/20">
                        {article.category || 'General'}
                    </span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-accent-primary transition-colors leading-snug">
                    {article.title}
                </h3>
                <p className="text-secondary-foreground text-sm line-clamp-3 mb-4 font-serif italic opacity-70">
                    {article.summary}
                </p>
            </Link>

            <div className="pt-4 border-t border-tertiary mt-auto">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <User size={12} />
                            <span className="font-semibold text-secondary-foreground">{article.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye size={12} />
                            <span>{article.viewCount} views</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {article.status === 'DRAFT' && (
                            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 font-bold uppercase text-[9px]">Draft</span>
                        )}
                        <Link to={`/article/${article.slug}`} className="text-accent-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            Read <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
