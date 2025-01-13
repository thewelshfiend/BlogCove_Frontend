import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './Pages/Auth'
import Layout from './Pages/Layout'
import Feed from './Components/Feed'
import MyBlogs from './Components/MyBlogs'
import Profile from './Components/Profile'
import { Toaster } from 'sonner'
import NoMatch from './Pages/NoMatch'
import { useSelector } from 'react-redux'

function App() {
    const isLoggedIn = useSelector((store) => (store.isLoggedIn));

    const loadTheme = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark/dark.css'; // Use CDN version
        document.head.appendChild(link);
    };

    loadTheme();

    return (
        <div className={`relative flex items-center bg-gray-900 min-h-dvh w-dvw ${isLoggedIn && 'sm:ps-24 sm:pe-[1.4%]'}`}>
            <Toaster richColors position="top-right" toastOptions={{ duration: 4000 }} />
            <BrowserRouter>
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Feed />} />
                        <Route path="my-blogs" element={<MyBlogs />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                    <Route path="*" element={<NoMatch />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App