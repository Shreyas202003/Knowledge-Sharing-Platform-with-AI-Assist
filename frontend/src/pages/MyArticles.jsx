import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ArticleCard from '../components/article/ArticleCard';
import { Loader2, PlusCircle, Book } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MyArticles = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['my-articles-full', page],
        queryFn: async () => {
            const res = await api.get(`/articles/mine?page=${page}&size=9&sort=updatedAt,desc`);
            return res.data.data;
        }
    });

    const articles = data?.content || [];
    const totalPages = data?.totalPages || 0;

    const handleDelete = async (id) => {
        try {
            await api.delete(`/articles/${id}`);
            refetch();
        } catch (err) {
            alert('Failed to delete article');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-primary/10 rounded-xl">
                        <Book className="text-accent-primary w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif font-bold">My Technical <span className="text-accent-primary">Journal</span></h1>
                        <p className="text-secondary-foreground italic mt-1 font-serif opacity-70">Manage your published insights and drafts</p>
                    </div>
                </div>
                <Link to="/write" className="btn-primary flex items-center gap-2 shadow-glow self-start">
                    <PlusCircle size={20} />
                    Write New Insight
                </Link>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-accent-primary">
                    <Loader2 className="animate-spin w-12 h-12 mb-4" />
                    <span className="font-serif italic text-lg tracking-wide">Syncing your journal...</span>
                </div>
            ) : isError ? (
                <div className="text-center py-20 text-red-500 border border-red-500/20 rounded-xl bg-red-500/5">
                    <p className="text-xl font-bold font-serif">Failed to load your articles.</p>
                </div>
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 border border-tertiary border-dashed rounded-3xl bg-secondary/20">
                    <Book className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-20" />
                    <h2 className="text-2xl font-serif font-bold mb-4">Your journal is empty</h2>
                    <p className="text-secondary-foreground max-w-md mx-auto mb-8 opacity-70">
                        You haven't shared any technical knowledge yet. Be the catalyst for innovation and start writing today.
                    </p>
                    <Link to="/write" className="btn-primary inline-flex items-center gap-2">
                        <PlusCircle size={18} />
                        Start Your First Article
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyArticles;
