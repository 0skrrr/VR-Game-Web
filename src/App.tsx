import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { Navbar } from './objects/Navbar.tsx';
import { Footer } from './objects/Footer';
import { ParticlesBackground } from './objects/ParticleBackground.tsx';
import { LoginModal } from './objects/LoginModal';
import Page01 from './pages/Page01';
import Page02 from './pages/Page02';
import Page03 from './pages/Page03';
import Page04 from './pages/Page04';
import Page05 from './pages/Page05';
import Page06 from './pages/Page06';

gsap.registerPlugin(useGSAP);

export function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const pageWrapperRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: pageWrapperRef });

    // Robust session check on mount (checks both backend & local mock fallback cookie)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/check-session', { credentials: 'include' });
                if (res.ok) {
                    setIsLoggedIn(true);
                    return;
                }
            } catch {}

            // Fallback check for local mock cookie if backend is inactive
            const hasMockCookie = document.cookie.split('; ').some(row => row.startsWith('session_token='));
            if (hasMockCookie) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, []);

    const handlePageChange = contextSafe((nextPage: number) => {
        if (nextPage === currentPage) return;
        setCurrentPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST', credentials: 'include' });
        } catch {}

        // Clear local mock cookie
        document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        setIsLoggedIn(false);
        if (currentPage === 6) {
            setCurrentPage(1);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 relative overflow-x-hidden">
            <ParticlesBackground />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Navbar
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    isLoggedIn={isLoggedIn}
                    onLoginClick={() => setIsLoginModalOpen(true)}
                    onLogoutClick={handleLogout}
                />

                <div ref={pageWrapperRef} style={{ position: 'relative', width: '100%', flex: 1, marginTop: '80px' }}>
                    <div className="page-content">
                        {currentPage === 1 && <Page01 />}
                        {currentPage === 2 && <Page02 />}
                        {currentPage === 3 && <Page03 />}
                        {currentPage === 4 && <Page04 />}
                        {currentPage === 5 && <Page05 />}
                        {currentPage === 6 && isLoggedIn && <Page06 onArticleAdded={() => {}} />}
                    </div>
                </div>

                <Footer />
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={() => {
                    setIsLoggedIn(true);
                    setCurrentPage(6);
                }}
            />
        </main>
    );
}