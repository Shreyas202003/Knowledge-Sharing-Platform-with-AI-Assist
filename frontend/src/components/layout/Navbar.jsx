import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogOut, User, PlusCircle, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-primary/80 backdrop-blur-md border-b border-tertiary">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <BookOpen className="text-accent-primary w-8 h-8" />
                    <span className="text-2xl font-serif font-bold tracking-tight">
                        Quantum<span className="text-accent-primary">Quill</span>
                    </span>
                </Link>

                <div className="flex-1 max-w-md mx-8 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search knowledge..."
                            className="w-full input-premium pl-10 h-10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/write" className="btn-primary flex items-center gap-2 py-1.5 px-4 shadow-glow">
                                <PlusCircle size={18} />
                                <span className="hidden sm:inline">Write</span>
                            </Link>
                            <Link to="/my-articles" className="text-sm font-bold text-secondary-foreground hover:text-accent-primary transition-colors ml-2">
                                My Articles
                            </Link>
                            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-tertiary">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-sm font-semibold">{user.username}</span>
                                    <span className="text-xs text-secondary-foreground">Author</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-secondary-foreground hover:text-accent-primary transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-ghost">Login</Link>
                            <Link to="/register" className="btn-primary py-1.5 px-4">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
