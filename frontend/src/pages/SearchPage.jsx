import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ArticleCard from '../components/article/ArticleCard';
import { Loader2, Search as SearchIcon, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const { data, isLoading, isError } = useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            const res = await api.get(`/articles/public?title=${encodeURIComponent(query)}&page=0&size=20&sort=createdAt,desc`);
            return res.data.data;
        },
        enabled: !!query
    });

    const articles = data?.content || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-accent-primary/10 rounded-xl">
                    <SearchIcon className="text-accent-primary w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-4xl font-serif font-bold">Search Results</h1>
                    <p className="text-secondary-foreground italic">Showing community articles for "{query}"</p>
                </div>
            </div>

            <div className="space-y-12">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-accent-primary">
                        <Loader2 className="animate-spin w-10 h-10 mb-4" />
                        <span className="font-serif italic font-bold">Searching technical archives...</span>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 text-red-500 border border-red-500/20 rounded-xl bg-red-500/5">
                        <p className="text-lg font-bold font-serif">Search encountered an error.</p>
                    </div>
                ) : articles.length > 0 ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </section>
                ) : (
                    <div className="text-center py-24 border border-tertiary border-dashed rounded-2xl bg-secondary/30">
                        <SearchIcon className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-20" />
                        <p className="text-2xl font-serif font-bold mb-4">No matching articles found.</p>
                        <p className="text-secondary-foreground max-w-md mx-auto">
                            We couldn't find any articles matching "{query}". Try different keywords or browse the home feed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
