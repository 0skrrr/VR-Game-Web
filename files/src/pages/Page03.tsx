import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useT } from '@/hooks/useTranslationProxy';
import './Page03.scss';

gsap.registerPlugin(useGSAP);

interface OerCategory {
    id: string;
    title: string;
    desc: string;
    actionLabel: string;
    actionUrl: string;
    badge: string;
}

export default function Page03() {
    const { t } = useT();
    const containerRef = useRef<HTMLDivElement>(null);

    const oerCategories: OerCategory[] = [
        {
            id: 'vr',
            title: t.vrModuleTitle || 'VR & Hardware Modules',
            desc: t.vrModuleDesc || 'Information, system requirements, and direct download links for the PC/VR Oculus software.',
            actionLabel: t.vrDownloadBtn || 'Download VR Software',
            actionUrl: '#download-vr',
            badge: t.badgeSoftware || 'Software',
        },
        {
            id: 'guides',
            title: t.guidesTitle || 'Downloadable Guides & Manuals',
            desc: t.guidesDesc || 'PDF repository for the Teacher Guide (WP4), Student User Manuals, and structured Lesson Plans.',
            actionLabel: t.guidesDownloadBtn || 'Access PDF Repository',
            actionUrl: '#download-guides',
            badge: t.badgeRepository || 'Repository',
        },
        {
            id: 'reports',
            title: t.reportsTitle || 'Reports & Research',
            desc: t.reportsDesc || 'Access to the Comparative Analysis Report (WP5), technical documentation, and related project publications.',
            actionLabel: t.reportsDownloadBtn || 'View Research Reports',
            actionUrl: '#download-reports',
            badge: t.badgeResearch || 'Research',
        },
    ];

    useGSAP(() => {
        gsap.from('.page-03-header', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: 'power3.out',
        });
        gsap.from('.oer-grid > div', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.2,
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="page-03 page-container">
            <div className="page-03-header">
                <h2>{t.resultsPageTitle || 'Results & Open Educational Resources (OER)'}</h2>
                <p>{t.resultsPageSubtitle || 'Access our open educational resources, VR software modules, mobile companion apps, pedagogical guides, and research reports.'}</p>
            </div>

            <div className="oer-grid">
                {oerCategories.map((item) => (
                    <div key={item.id} className="oer-card">
                        <div className="card-top">
                            <span className="oer-badge">{item.badge}</span>
                        </div>
                        <div className="card-body">
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                        <div className="card-footer">
                            <a href={item.actionUrl} className="oer-action-btn">
                                {item.actionLabel}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}