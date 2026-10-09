import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { Navbar } from './objects/Navbar.tsx';
import { Footer } from './objects/Footer';
import { ParticlesBackground } from './objects/ParticleBackground.tsx';
import Page01 from './pages/Page01';
import Page02 from './pages/Page02';
import Page03 from './pages/Page03';
import Page04 from './pages/Page04';
import Page05 from './pages/Page05';

gsap.registerPlugin(useGSAP);

export function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [targetPage, setTargetPage] = useState(1);
    const pageWrapperRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: pageWrapperRef });

    const handlePageChange = contextSafe((nextPage: number) => {
        if (nextPage === currentPage) return;
        setCurrentPage(nextPage);
        setTargetPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return (
        <main className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 relative overflow-x-hidden">
            {/* Background Particle layer */}
            <ParticlesBackground />

            {/* Main Application Layers with z-index to stay above particles */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Navbar currentPage={targetPage} onPageChange={handlePageChange} />

                <div ref={pageWrapperRef} style={{ position: 'relative', width: '100%', flex: 1, marginTop: '80px' }}>
                    <div className="page-content">
                        {currentPage === 1 && <Page01 />}
                        {currentPage === 2 && <Page02 />}
                        {currentPage === 3 && <Page03 />}
                        {currentPage === 4 && <Page04 />}
                        {currentPage === 5 && <Page05 />}
                    </div>
                </div>

                <Footer />
            </div>
        </main>
    );
}