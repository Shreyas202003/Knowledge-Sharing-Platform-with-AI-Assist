import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ArticleCard from '../components/article/ArticleCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Home = () => {
    const [page, setPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();
    const { user } = useAuth();

    const categories = ['All', 'Tech', 'AI', 'Backend', 'Frontend', 'DevOps', 'Cloud', 'Security'];

    const { data, isLoading, isError, refetch: refetchPublic } = useQuery({
        queryKey: ['articles', page, selectedCategory],
        queryFn: async () => {
            const res = await api.get(`/articles/public?page=${page}&size=6&sort=createdAt,desc&category=${selectedCategory === 'All' ? '' : selectedCategory}`);
            return res.data.data;
        },
        keepPreviousData: true
    });

    const { data: myData, isLoading: isMyLoading, refetch: refetchMy } = useQuery({
        queryKey: ['my-articles'],
        queryFn: async () => {
            const res = await api.get('/articles/mine?size=3&sort=updatedAt,desc');
            return res.data.data;
        },
        enabled: !!user
    });

    const articles = data?.content || [];
    const myArticles = myData?.content || [];
    const totalPages = data?.totalPages || 0;

    const handleDelete = async (id) => {
        try {
            await api.delete(`/articles/${id}`);
            refetchPublic();
            refetchMy();
        } catch (err) {
            alert('Failed to delete article');
        }
    };

    const scrollToArticles = () => {
        const section = document.getElementById('articles-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        } else if (articles.length === 0) {
            navigate('/write');
        }
    };

    const handleJoinClick = () => {
        if (user) {
            navigate('/write');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20">
            <section className="py-12 flex flex-col items-center text-center">
                <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 tracking-tight">
                    Where curiosity meets <span className="text-accent-primary">expertise</span>.
                </h1>
                <p className="text-xl text-secondary-foreground max-w-2xl mb-10 leading-relaxed font-serif italic opacity-80">
                    A premium platform for technical minds to share, discover, and build technical knowledge.
                </p>
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollToArticles}
                        className="btn-primary flex items-center gap-2 shadow-glow"
                    >
                        Explore Knowledge
                    </motion.button>
                    {!user && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleJoinClick}
                            className="btn-secondary transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        >
                            Join Community
                        </motion.button>
                    )}
                </div>
            </section>

            {user && myArticles.length > 0 && (
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-1 bg-accent-primary rounded-full"></div>
                            <h2 className="text-3xl font-serif font-bold">My Technical Journal</h2>
                        </div>
                        <button onClick={() => navigate('/write')} className="text-sm text-accent-primary hover:underline font-bold">Write New +</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} onDelete={handleDelete} />
                        ))}
                    </div>
                </section>
            )}

            <div id="articles-section" className="pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-slate-700 rounded-full"></div>
                        <h2 className="text-3xl font-serif font-bold text-slate-300">Global Knowledge Feed</h2>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setPage(0);
                                }}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                                    selectedCategory === cat
                                        ? "bg-accent-primary border-accent-primary text-primary-foreground shadow-glow-sm"
                                        : "bg-secondary/50 border-tertiary text-secondary-foreground hover:border-accent-primary/50"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-accent-primary">
                        <Loader2 className="animate-spin w-10 h-10 mb-4" />
                        <span className="font-serif italic font-medium">Curating technical insights...</span>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 text-red-500 border border-red-500/20 rounded-xl bg-red-500/5">
                        <p className="text-lg font-bold font-serif">Failed to load articles.</p>
                        <p className="text-sm opacity-70 mt-1">Please ensure the backend is active at port 8085.</p>
                    </div>
                ) : (
                    <>
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <ArticleCard key={article.id} article={article} onDelete={handleDelete} />
                            ))}
                        </section>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-16">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-2 rounded-full border border-tertiary disabled:opacity-20 hover:bg-secondary transition-colors"
                                >
                                    <ChevronLeft />
                                </button>
                                <span className="font-serif font-bold">Page {page + 1} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page === totalPages - 1}
                                    className="p-2 rounded-full border border-tertiary disabled:opacity-20 hover:bg-secondary transition-colors"
                                >
                                    <ChevronRight />
                                </button>
                            </div>
                        )}

                        {articles.length === 0 && (
                            <div className="text-center py-20 text-secondary-foreground border border-tertiary border-dashed rounded-xl bg-secondary/10">
                                <p className="text-xl font-serif font-medium">No articles published yet.</p>
                                <p className="mt-2 text-sm opacity-60 italic">Be the catalyst for knowledge share!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
