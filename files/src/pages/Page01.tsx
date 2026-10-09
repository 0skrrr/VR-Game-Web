import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useT } from '@/hooks/useTranslationProxy';
import './Page01.scss';
import logo from '../images/logo3.svg';

gsap.registerPlugin(useGSAP);

export default function Page01() {
    const { t } = useT();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.hero-banner, .stats-container, .featured-grid, .news-section, .eu-banner-box', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="page-01 page-container">
            {/* Hero Wrapper containing Hero Banner and Logo side-by-side (Logo on right) */}
            <div className="hero-wrapper">
                <section className="hero-banner">
                    <h1>{t.heroTitle}</h1>
                    <p className="mission-statement">
                        {t.heroMission1} {t.heroMission2}
                    </p>
                </section>

                <div className="hero-logo-container">
                    <img src={logo} alt="Project Logo" className="hero-logo" />
                </div>
            </div>

            {/* Quick Stats Counter */}
            <section className="stats-container">
                <div className="stat-card">
                    <span className="stat-number">6</span>
                    <span className="stat-label">{t.statPartners || 'Partner Organizations'}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">3+</span>
                    <span className="stat-label">{t.statScenarios || 'Developed VR Scenarios'}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">25+</span>
                    <span className="stat-label">{t.statTrained || 'Trained Teachers & Students'}</span>
                </div>
            </section>

        </div>
    );
}