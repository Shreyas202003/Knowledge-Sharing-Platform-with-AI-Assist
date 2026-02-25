import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-primary flex flex-col">
            <Navbar />
            <main className="pt-24 pb-12 flex-1">
                {children}
            </main>
            <footer className="border-t border-tertiary py-8 text-center text-secondary-foreground bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="font-serif">© 2026 QuantumQuill - Technical Knowledge Sharing Platform</p>
                    <p className="mt-2 text-sm opacity-50">Built with Spring Boot 3 & React 18</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
