import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleCreate from './pages/ArticleCreate';
import ArticleEdit from './pages/ArticleEdit';
import ArticleDetail from './pages/ArticleDetail';
import SearchPage from './pages/SearchPage';
import MyArticles from './pages/MyArticles';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/article/:slug" element={<ArticleDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/write"
                element={
                  <ProtectedRoute>
                    <ArticleCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:slug"
                element={
                  <ProtectedRoute>
                    <ArticleEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-articles"
                element={
                  <ProtectedRoute>
                    <MyArticles />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
