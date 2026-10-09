import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useT } from '@/hooks/useTranslationProxy';
import './Page02.scss';

gsap.registerPlugin(useGSAP);

interface PartnerInfo {
    id: string;
    code: string;
    country: string;
    role: string;
    url: string;
}

export default function Page02() {
    const { t } = useT();
    const containerRef = useRef<HTMLDivElement>(null);

    const partners: PartnerInfo[] = [
        { id: 'cz', code: '🇨🇿', country: t.partnerCzCountry || 'Czech Republic', role: t.partnerCzRole || 'Coordinator & Project Management', url: 'https://example.cz' },
        { id: 'hr', code: '🇭🇷', country: t.partnerHrCountry || 'Croatia', role: t.partnerHrRole || 'Host Partner & VET Integration', url: 'https://example.hr' },
        { id: 'al', code: '🇦🇱', country: t.partnerAlCountry || 'Albania', role: t.partnerAlRole || 'Pedagogy & Teacher Guide (WP4)', url: 'https://example.al' },
        { id: 'tr', code: '🇹🇷', country: t.partnerTrCountry || 'Turkey', role: t.partnerTrRole || 'Mobile Application Development', url: 'https://example.tr' },
        { id: 'pt', code: '🇵🇹', country: t.partnerPtCountry || 'Portugal', role: t.partnerPtRole || 'Unity & VR Core Development', url: 'https://example.pt' },
        { id: 'sk', code: '🇸🇰', country: t.partnerSkCountry || 'Slovakia', role: t.partnerSkRole || '3D Modeling & Blender Assets', url: 'https://example.sk' },
    ];

    useGSAP(() => {
        gsap.from('.page-02-header', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: 'power3.out',
        });
        gsap.from('.about-section, .partners-section', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2,
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="page-02 page-container">
            <div className="page-02-header">
                <h2>{t.aboutPageTitle || 'About the Project'}</h2>
                <p>{t.aboutPageSubtitle || 'Discover our background, target groups, structured work packages, and the consortium partner institutions across Europe.'}</p>
            </div>

            <div className="about-content-grid">
                <div className="about-section">
                    <h3>{t.projectOverviewTitle || 'Project Overview & Target Groups'}</h3>
                    <p>{t.projectOverviewDesc || 'Our Erasmus+ VET project bridges modern extended reality technologies with vocational education and training. We specifically target VET teachers and students, ensuring seamless curriculum integration, immersive skill development, and cross-border collaboration.'}</p>
                </div>

                <div className="about-section">
                    <h3>{t.wpOverviewTitle || 'Work Packages Overview'}</h3>
                    <p>{t.wpOverviewDesc || 'Structured across specialized work packages—from project management and pedagogical guidance (WP4) to VR core development, mobile application creation, and 3D modeling assets—our consortium delivers comprehensive open educational resources.'}</p>
                </div>
            </div>

            <div className="partners-section">
                <h3 className="section-title">{t.consortiumPartnersTitle || 'Consortium Partner Institutions'}</h3>
                <div className="partners-grid">
                    {partners.map((p) => (
                        <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="partner-card">
                            <span className="partner-flag">{p.code}</span>
                            <div className="partner-info">
                                <h4>{p.country}</h4>
                                <p>{p.role}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}